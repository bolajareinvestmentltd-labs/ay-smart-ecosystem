import json
import os
from datetime import timedelta
from decimal import Decimal

import requests

from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils import timezone
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.db import models
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.throttling import SimpleRateThrottle
import hashlib
import hmac
import base64
import logging
from django.conf import settings

from .models import (
    BranchLocation, BuildProject, InspectionBooking, Promotion,
    Listing, ListingImage, PaymentTransaction, PickupVoucher, Property, SupportRequest, UserProfile,
    Vehicle, Wallet, WalletTransaction, SavedSearch, FavoriteListing, HiddenListing, Conversation, ConversationMessage,
)
from .serializers import (
    BranchLocationSerializer, VehicleSerializer,
    PropertySerializer, InspectionBookingSerializer, PropertyImageUploadSerializer,
    BuildProjectSerializer, PromotionSerializer, SavedSearchSerializer, FavoriteListingSerializer,
    HiddenListingSerializer, ConversationSerializer, ConversationMessageSerializer,
)
from .models import Referral
from .serializers import (
    ListingSerializer, PaymentTransactionSerializer, ReferralSerializer, SupportRequestSerializer, UserProfileSerializer,
    WalletSerializer, WalletTransactionSerializer,
)


def send_verification_email(user: User):
    from django.conf import settings
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    verify_url = f"{settings.FRONTEND_URL.rstrip('/')}/auth/verify-email?uid={uid}&token={token}"

    subject = "Verify your AY'SMART email"
    message = (
        f"Hello {user.get_full_name() or user.username},\n\n"
        "Welcome to AY'SMART. Please verify your email address by clicking the link below:\n\n"
        f"{verify_url}\n\n"
        "If you did not create this account, you can safely ignore this message.\n\n"
        "Thank you,\nAY'SMART Team"
    )
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@resend.dev')
    resend_api_key = getattr(settings, 'RESEND_API_KEY', '') or os.getenv('RESEND_API_KEY', '')
    if resend_api_key:
        try:
            payload = {
                'from': from_email,
                'to': [user.email],
                'subject': subject,
                'text': message,
            }
            response = requests.post(
                'https://api.resend.com/emails',
                headers={
                    'Authorization': f'Bearer {resend_api_key}',
                    'Content-Type': 'application/json',
                },
                json=payload,
                timeout=10,
            )
            response.raise_for_status()
        except Exception:
            send_mail(subject, message, from_email, [user.email], fail_silently=False)
    else:
        send_mail(subject, message, from_email, [user.email], fail_silently=False)
    # Record timestamp on profile for server-side cooldown and clear bounce flag
    try:
        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.last_verification_sent_at = timezone.now()
        profile.email_bounced = False
        profile.save(update_fields=['last_verification_sent_at', 'email_bounced'])
    except Exception:
        pass


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = (request.data.get('username') or '').strip()
        email = (request.data.get('email') or '').strip()
        password = request.data.get('password') or ''
        first_name = (request.data.get('first_name') or '').strip()
        last_name = (request.data.get('last_name') or '').strip()
        phone = (request.data.get('phone') or '').strip()
        location = (request.data.get('location') or '').strip()
        role = (request.data.get('role') or 'seller').strip().lower()
        matric_number = (request.data.get('matric_number') or '').strip()
        student_email = (request.data.get('student_email') or '').strip()

        if not username or not email or not password:
            return Response({'detail': 'username, email, and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            return Response({'detail': 'A user with that username or email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name)
        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.phone = phone
        profile.location = location
        profile.role = role if role in dict(UserProfile.ROLE_CHOICES).keys() else 'seller'
        profile.save()

        if matric_number or student_email:
            profile.role = 'student' if role in {'student', 'both'} else profile.role
            profile.student_matric_number = matric_number
            profile.student_email = student_email
            profile.save()

        Wallet.objects.get_or_create(user=user)
        email_sent = True
        try:
            send_verification_email(user)
        except Exception:
            # Log the exception and continue — registration should succeed even if email isn't sent.
            logging.exception('Failed to send verification email for user %s', user.username)
            email_sent = False

        response_payload = {'id': user.id, 'username': user.username, 'email': user.email, 'role': profile.role}
        if not email_sent:
            # Include a non-fatal warning so the frontend can inform the user without treating it as a failure.
            response_payload['warning'] = 'Verification email could not be sent. Check email configuration.'

        return Response(response_payload, status=status.HTTP_201_CREATED)


class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        data = UserProfileSerializer(profile).data
        data.update({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'name': ' '.join(filter(None, [request.user.first_name, request.user.last_name])).strip(),
        })
        return Response(data)

class EmailVerificationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uid') or ''
        token = request.data.get('token') or ''
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'detail': 'Invalid verification token.'}, status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.email_verified = True
            profile.save(update_fields=['email_verified'])
            return Response({'detail': 'Email verified successfully.'}, status=status.HTTP_200_OK)

        return Response({'detail': 'Invalid or expired verification token.'}, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = (request.data.get('email') or '').strip().lower()
        new_password = request.data.get('new_password') or request.data.get('password') or ''

        if not email or not new_password:
            return Response({'detail': 'Email and a new password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email__iexact=email).first()
        if user:
            user.set_password(new_password)
            user.save(update_fields=['password'])
            try:
                send_mail(
                    'Your AY\'SMART password was updated',
                    'Your password was successfully updated. If you did not request this change, contact support immediately.',
                    getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@resend.dev'),
                    [user.email],
                    fail_silently=True,
                )
            except Exception:
                pass

        return Response({'detail': 'If an account exists for that email, the password has been updated.'}, status=status.HTTP_200_OK)


class ResendVerificationView(APIView):
    permission_classes = [permissions.AllowAny]
    from rest_framework.throttling import SimpleRateThrottle

    class _ResendRateThrottle(SimpleRateThrottle):
        scope = 'resend_verification'

        def get_cache_key(self, request, view):
            # Prefer per-email throttling; fall back to IP when not provided
            try:
                email = (request.data.get('email') or '').strip().lower()
            except Exception:
                email = ''
            if email:
                ident = email
            else:
                ident = self.get_ident(request)
            return self.cache_format % {'scope': self.scope, 'ident': ident}

    throttle_classes = [_ResendRateThrottle]

    def post(self, request):
        email = (request.data.get('email') or '').strip()
        if not email:
            return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'No user found with that email.'}, status=status.HTTP_404_NOT_FOUND)

        profile, _ = UserProfile.objects.get_or_create(user=user)
        if getattr(profile, 'email_verified', False):
            return Response({'detail': 'Email already verified.'}, status=status.HTTP_200_OK)
        # Enforce server-side cooldown (60s)
        cooldown_seconds = 60
        last = getattr(profile, 'last_verification_sent_at', None)
        if last:
            delta = timezone.now() - last
            if delta.total_seconds() < cooldown_seconds:
                remaining = int(cooldown_seconds - delta.total_seconds())
                return Response({'detail': f'Please wait {remaining} seconds before resending.'}, status=429)

        try:
            send_verification_email(user)
        except Exception:
            return Response({'detail': 'Failed to send verification email.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'detail': 'Verification email sent.'}, status=status.HTTP_200_OK)

    def get(self, request):
        user = request.user
        return Response({'id': user.id, 'username': user.username, 'email': user.email})


class EmailVerificationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uid') or ''
        token = request.data.get('token') or ''
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'detail': 'Invalid verification token.'}, status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.email_verified = True
            profile.save(update_fields=['email_verified'])
            return Response({'detail': 'Email verified successfully.'}, status=status.HTTP_200_OK)

        return Response({'detail': 'Invalid or expired verification token.'}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        data = UserProfileSerializer(profile).data
        data.update({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'name': ' '.join(filter(None, [request.user.first_name, request.user.last_name])).strip(),
        })
        return Response(data)

    def put(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(instance=profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        data = UserProfileSerializer(profile).data
        data.update({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'name': ' '.join(filter(None, [request.user.first_name, request.user.last_name])).strip(),
        })
        return Response(data)


class EmailWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Basic webhook receiver for Resend and legacy provider bounce events.
        payload = request.data
        logger = logging.getLogger(__name__)

        # Verify Resend signature when present
        try:
            secret = os.getenv('RESEND_WEBHOOK_SIGNING_SECRET', '') or getattr(settings, 'RESEND_WEBHOOK_SIGNING_SECRET', '')
            if secret:
                signature_headers = [
                    request.headers.get('resend-signature'),
                    request.headers.get('X-Resend-Signature'),
                ]
                timestamp_headers = [
                    request.headers.get('resend-timestamp'),
                    request.headers.get('X-Resend-Timestamp'),
                ]
                timestamp = next((value for value in timestamp_headers if value), '')
                for header_value in signature_headers:
                    if not header_value:
                        continue
                    sig_value = header_value
                    if sig_value.startswith('v1,'):
                        sig_value = sig_value.split('=', 1)[1] if '=' in sig_value else sig_value.split(',', 1)[1]
                    elif 'v1=' in sig_value:
                        sig_value = sig_value.split('v1=', 1)[1].split(',', 1)[0]
                    elif sig_value.startswith('sha256='):
                        sig_value = sig_value.split('=', 1)[1]
                    body = request.body or b''
                    signed_payload = f"{timestamp}.{body.decode('utf-8')}" if timestamp else body.decode('utf-8')
                    expected = hmac.new(secret.encode('utf-8'), signed_payload.encode('utf-8'), hashlib.sha256).hexdigest()
                    if hmac.compare_digest(expected, sig_value):
                        break
                    else:
                        logger.warning('Resend webhook signature mismatch')
                        return Response({'detail': 'Invalid webhook signature'}, status=status.HTTP_403_FORBIDDEN)
        except Exception:
            logger.exception('Error verifying resend signature')
            return Response({'detail': 'Webhook verification error'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify Mailgun signature when present
        try:
            if isinstance(payload, dict) and 'signature' in payload:
                sig = payload.get('signature') or {}
                timestamp = sig.get('timestamp')
                token = sig.get('token')
                signature = sig.get('signature')
                key = os.getenv('MAILGUN_WEBHOOK_KEY', '') or getattr(settings, 'MAILGUN_WEBHOOK_KEY', '')
                if key and timestamp and token and signature:
                    mac = hmac.new(key.encode('utf-8'), f"{timestamp}{token}".encode('utf-8'), hashlib.sha256).hexdigest()
                    if not hmac.compare_digest(mac, signature):
                        logger.warning('Mailgun webhook signature mismatch')
                        return Response({'detail': 'Invalid webhook signature'}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            logger.exception('Error verifying mailgun signature')
            return Response({'detail': 'Webhook verification error'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify SendGrid signed event webhook when headers and public key present
        try:
            sg_sig = request.headers.get('X-Twilio-Email-Event-Webhook-Signature')
            sg_ts = request.headers.get('X-Twilio-Email-Event-Webhook-Timestamp')
            sg_key = os.getenv('SENDGRID_WEBHOOK_PUBLIC_KEY', '') or getattr(settings, 'SENDGRID_WEBHOOK_PUBLIC_KEY', '')
            if sg_sig and sg_ts and sg_key:
                # SendGrid signature is ed25519 over timestamp + body
                try:
                    from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey
                    from cryptography.hazmat.primitives import serialization
                    body = request.body or b''
                    signed = (sg_ts + body.decode('utf-8')).encode('utf-8')
                    signature_bytes = base64.b64decode(sg_sig)
                    # Load public key (PEM or raw base64). Try PEM first.
                    try:
                        pub = serialization.load_pem_public_key(sg_key.encode('utf-8'))
                    except Exception:
                        # Try raw base64 public key
                        try:
                            raw = base64.b64decode(sg_key)
                            pub = Ed25519PublicKey.from_public_bytes(raw)
                        except Exception:
                            raise
                    pub.verify(signature_bytes, signed)
                except Exception:
                    logger.warning('SendGrid webhook signature verification failed')
                    return Response({'detail': 'Invalid webhook signature'}, status=status.HTTP_403_FORBIDDEN)
        except Exception:
            logger.exception('Error verifying SendGrid signature')
            return Response({'detail': 'Webhook verification error'}, status=status.HTTP_400_BAD_REQUEST)
        # Try SendGrid-style event array
        try:
            if isinstance(payload, list):
                for ev in payload:
                    if ev.get('event') in ('bounce', 'dropped'):
                        email = ev.get('email') or ev.get('to')
                        if email:
                            try:
                                user = User.objects.filter(email__iexact=email).first()
                                if user:
                                    profile, _ = UserProfile.objects.get_or_create(user=user)
                                    profile.email_bounced = True
                                    profile.save(update_fields=['email_bounced'])
                            except Exception:
                                pass
                return Response({'detail': 'Processed events'}, status=status.HTTP_200_OK)

            # Mailgun style
            if 'event-data' in payload:
                ed = payload['event-data']
                if ed.get('event') in ('bounced', 'failed'):
                    recipients = ed.get('recipient') or ed.get('recipients')
                    if isinstance(recipients, str):
                        recipients = [recipients]
                    for email in recipients or []:
                        try:
                            user = User.objects.filter(email__iexact=email).first()
                            if user:
                                profile, _ = UserProfile.objects.get_or_create(user=user)
                                profile.email_bounced = True
                                profile.save(update_fields=['email_bounced'])
                        except Exception:
                            pass
                return Response({'detail': 'Processed mailgun event'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'detail': 'Webhook processing error'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'detail': 'No recognized event'}, status=status.HTTP_200_OK)

    def put(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(instance=profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        data = UserProfileSerializer(profile).data
        data.update({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'name': ' '.join(filter(None, [request.user.first_name, request.user.last_name])).strip(),
        })
        return Response(data)


class KycApprovalView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        if profile.role in {'student', 'both'} and (not profile.student_matric_number or not profile.student_email or not profile.student_id_image):
            return Response(
                {'detail': 'Student accounts must provide matric number, student email, and student ID image before KYC review.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if profile.is_kyc_verified and profile.is_admin_approved:
            return Response(UserProfileSerializer(profile).data, status=status.HTTP_200_OK)

        profile.kyc_status = 'PENDING'
        profile.kyc_provider = (request.data.get('provider') or profile.kyc_provider or '').strip()[:40]
        profile.kyc_reference = (request.data.get('reference') or profile.kyc_reference or '').strip()[:120]
        profile.kyc_rejection_reason = ''
        profile.save(update_fields=['kyc_status', 'kyc_provider', 'kyc_reference', 'kyc_rejection_reason', 'updated_at'])
        return Response({
            'detail': 'KYC submitted for admin review. Verification is not complete until an administrator approves it.',
            **UserProfileSerializer(profile).data,
        }, status=status.HTTP_202_ACCEPTED)


class BranchLocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BranchLocation.objects.filter(is_active=True)
    serializer_class = BranchLocationSerializer
    permission_classes = [permissions.AllowAny]

class VehicleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Vehicle.objects.all().order_by('-created_at')
    serializer_class = VehicleSerializer
    permission_classes = [permissions.AllowAny]

class PropertyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Property.objects.filter(is_available=True).order_by('-id')
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'
    parser_classes = [MultiPartParser, FormParser]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated], parser_classes=[MultiPartParser, FormParser])
    def upload_image(self, request, id=None):
        property_obj = self.get_object()
        serializer = PropertyImageUploadSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(property=property_obj)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.filter(is_active=True).order_by('display_order', '-updated_at')
    serializer_class = PromotionSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        return Promotion.objects.filter(is_active=True).order_by('display_order', '-updated_at')

class InspectionBookingViewSet(viewsets.ModelViewSet):
    queryset = InspectionBooking.objects.all().order_by('-id')
    serializer_class = InspectionBookingSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if self.request.user.is_staff:
            return InspectionBooking.objects.all().order_by('-id')
        if self.request.user.is_authenticated:
            return InspectionBooking.objects.filter(
                models.Q(client_user=self.request.user) |
                models.Q(assigned_agent=self.request.user)
            ).order_by('-id')
        return InspectionBooking.objects.filter(status='AGENT_OFFERED').order_by('-id')

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def respond(self, request, pk=None):
        booking = self.get_object()
        if booking.assigned_agent != request.user:
            return Response({'detail': 'Only the assigned agent can respond.'}, status=status.HTTP_403_FORBIDDEN)

        decision = (request.data.get('decision') or '').strip().upper()
        if decision not in {'YES', 'NO'}:
            return Response({'detail': 'decision must be YES or NO.'}, status=status.HTTP_400_BAD_REQUEST)

        booking.agent_response = 'ACCEPTED' if decision == 'YES' else 'REJECTED'
        booking.status = 'CONFIRMED' if decision == 'YES' else 'PENDING'
        booking.save(update_fields=['agent_response', 'status'])

        if decision == 'YES':
            booking.agent_confirmed = True
            booking.save(update_fields=['agent_confirmed'])
            try:
                send_mail(
                    'Inspection Agent Accepted',
                    f"Your inspection booking for {booking.property_to_view.title} has been accepted by {request.user.get_full_name() or request.user.username}.",
                    getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@resend.dev'),
                    [booking.client_user.email] if booking.client_user and booking.client_user.email else [],
                    fail_silently=True,
                )
            except Exception:
                pass

        return Response(InspectionBookingSerializer(booking).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def send_message(self, request, pk=None):
        booking = self.get_object()
        role = 'ADMIN' if request.user.is_staff else ('AGENT' if booking.assigned_agent == request.user else 'CLIENT')
        message = request.data.get('text', '').strip()
        if not message:
            return Response({'detail': 'text is required.'}, status=status.HTTP_400_BAD_REQUEST)

        msg = InspectionBookingMessage.objects.create(
            booking=booking,
            sender=request.user,
            sender_name=request.user.get_full_name() or request.user.username,
            sender_role=role,
            text=message,
        )
        return Response(InspectionBookingMessageSerializer(msg).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def conclude(self, request, pk=None):
        booking = self.get_object()
        if booking.client_user != request.user and booking.assigned_agent != request.user and not request.user.is_staff:
            return Response({'detail': 'Not authorized to conclude this inspection.'}, status=status.HTTP_403_FORBIDDEN)

        if booking.client_user == request.user:
            booking.client_confirmed = True
        if booking.assigned_agent == request.user:
            booking.agent_confirmed = True
        booking.save(update_fields=['client_confirmed', 'agent_confirmed'])
        return Response(InspectionBookingSerializer(booking).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        booking = self.get_object()
        if not booking.client_confirmed or not booking.agent_confirmed:
            return Response({'detail': 'Both client and agent must confirm before admin approval.'}, status=status.HTTP_400_BAD_REQUEST)
        booking.admin_approved = True
        booking.contact_released = True
        booking.status = 'COMPLETED'
        booking.save(update_fields=['admin_approved', 'contact_released', 'status'])
        return Response(InspectionBookingSerializer(booking).data, status=status.HTTP_200_OK)

class BuildProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BuildProject.objects.all()
    serializer_class = BuildProjectSerializer
    permission_classes = [permissions.IsAuthenticated]


class SavedSearchViewSet(viewsets.ModelViewSet):
    serializer_class = SavedSearchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedSearch.objects.filter(user=self.request.user).order_by('-updated_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FavoriteListingViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FavoriteListing.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class HiddenListingViewSet(viewsets.ModelViewSet):
    serializer_class = HiddenListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return HiddenListing.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user).order_by('-updated_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def reply(self, request, pk=None):
        conversation = self.get_object()
        message = (request.data.get('message') or '').strip()
        if not message:
            return Response({'detail': 'message is required.'}, status=status.HTTP_400_BAD_REQUEST)
        obj = ConversationMessage.objects.create(
            conversation=conversation,
            sender=request.user,
            sender_name=request.user.get_full_name() or request.user.username,
            text=message,
        )
        conversation.status = 'REPLIED'
        conversation.save(update_fields=['status', 'updated_at'])
        return Response(ConversationMessageSerializer(obj).data, status=status.HTTP_201_CREATED)


class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.all().order_by('-id')
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Listing.objects.all().order_by('-id')
        return Listing.objects.filter(user=self.request.user).order_by('-id')

    def create(self, request, *args, **kwargs):
        profile = UserProfile.objects.filter(user=request.user).first()
        if not profile or profile.role not in {'seller', 'agent', 'both'}:
            return Response({'detail': 'Only seller or agent accounts can submit listings.'}, status=status.HTTP_403_FORBIDDEN)
        if not profile.is_kyc_verified or not profile.is_admin_approved:
            return Response({'detail': 'Complete KYC and wait for admin account approval before submitting listings.'}, status=status.HTTP_403_FORBIDDEN)

        image_files = request.FILES.getlist('images') or request.FILES.getlist('image')
        if len(image_files) < 5:
            return Response({'detail': 'Please upload at least 5 property images before submitting for review.'}, status=status.HTTP_400_BAD_REQUEST)

        raw_facilities = request.data.get('facilities', [])
        if isinstance(raw_facilities, str):
            try:
                raw_facilities = json.loads(raw_facilities)
            except json.JSONDecodeError:
                raw_facilities = [item.strip() for item in raw_facilities.split(',') if item.strip()]
        if not isinstance(raw_facilities, list):
            return Response({'detail': 'Facilities must be a list of text values.'}, status=status.HTTP_400_BAD_REQUEST)

        payload = {
            'title': request.data.get('title', ''),
            'category': request.data.get('category', 'Property'),
            'description': request.data.get('description', ''),
            'location': request.data.get('location', ''),
            'price': request.data.get('price', '0'),
            'facilities': raw_facilities,
            'plan': request.data.get('plan', 'basic'),
            'duration_days': request.data.get('duration_days', 30),
        }
        serializer = self.get_serializer(data=payload)
        serializer.is_valid(raise_exception=True)
        listing = serializer.save(user=request.user)

        for index, uploaded in enumerate(image_files[:10]):
            ListingImage.objects.create(listing=listing, image=uploaded, order=index)

        headers = self.get_success_headers(serializer.data)
        return Response(ListingSerializer(listing, context={'request': request}).data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny], url_path='published')
    def published(self, request):
        listings = Listing.objects.filter(status='LIVE').order_by('-updated_at', '-id')
        return Response(ListingSerializer(listings, many=True, context={'request': request}).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def review(self, request, pk=None):
        if not request.user.is_staff:
            return Response({'detail': 'Admin access required.'}, status=status.HTTP_403_FORBIDDEN)

        listing = self.get_object()
        decision = (request.data.get('decision') or 'APPROVE').strip().upper()
        if decision not in {'APPROVE', 'REJECT'}:
            return Response({'detail': 'decision must be APPROVE or REJECT.'}, status=status.HTTP_400_BAD_REQUEST)

        listing.status = 'LIVE' if decision == 'APPROVE' else 'REJECTED'
        listing.save(update_fields=['status'])
        return Response(ListingSerializer(listing).data, status=status.HTTP_200_OK)


class ReferralViewSet(viewsets.ModelViewSet):
    queryset = Referral.objects.all().order_by('-created_at')
    serializer_class = ReferralSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        if 'email' in data and 'referred_email' not in data:
            data['referred_email'] = data.pop('email')

        if request.user.is_authenticated:
            data['referrer'] = request.user.id
        else:
            data['referrer'] = None

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Referral.objects.all().order_by('-created_at')
        return Referral.objects.filter(referrer=self.request.user).order_by('-created_at') if self.request.user.is_authenticated else Referral.objects.none()

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        # Admin endpoint to confirm a referral and credit the referrer.
        # Allows admin JWT or machine X-API-KEY header matching ADMIN_API_KEY env var.
        api_key = request.headers.get('X-API-KEY') or request.META.get('HTTP_X_API_KEY')
        is_api_key_valid = api_key and api_key == os.getenv('ADMIN_API_KEY')

        if not (request.user and request.user.is_staff) and not is_api_key_valid:
            return Response({'detail': 'Admin credentials or valid API key required.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            referral = self.get_object()
        except Referral.DoesNotExist:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        if referral.status == 'CONFIRMED':
            return Response({'detail': 'Already confirmed'}, status=status.HTTP_400_BAD_REQUEST)

        referral.confirm()
        return Response({'detail': 'Referral confirmed and credited.'}, status=status.HTTP_200_OK)


class SupportRequestViewSet(viewsets.ModelViewSet):
    queryset = SupportRequest.objects.all().order_by('-created_at')
    serializer_class = SupportRequestSerializer
    permission_classes = [permissions.AllowAny]


class WalletViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Wallet.objects.all()
    serializer_class = WalletSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wallet.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(wallet)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def transactions(self, request):
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        serializer = WalletTransactionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        amount = Decimal(str(serializer.validated_data['amount']))
        description = serializer.validated_data.get('description', '')
        kind = serializer.validated_data.get('kind', 'DEBIT')

        if kind == 'CREDIT':
            wallet.credit(amount, reason=description)
        else:
            wallet.debit(abs(amount), reason=description)

        tx = WalletTransaction.objects.filter(user=request.user).order_by('-created_at').first()
        return Response(WalletTransactionSerializer(tx).data, status=status.HTTP_201_CREATED)


class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        plan = (request.data.get('plan') or 'basic').strip().lower()
        amount = request.data.get('amount')

        try:
            amount_value = Decimal(str(amount))
        except Exception:
            return Response({'detail': 'A valid amount is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if amount_value <= 0:
            return Response({'detail': 'Amount must be greater than zero.'}, status=status.HTTP_400_BAD_REQUEST)

        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        if wallet.balance < amount_value:
            return Response({'detail': 'Insufficient wallet balance.'}, status=status.HTTP_400_BAD_REQUEST)

        wallet.debit(amount_value, reason=f"Subscription {plan}")
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile.subscription_plan = plan
        profile.subscription_status = 'active'
        profile.subscription_expires_at = timezone.now() + timedelta(days=7)
        profile.save()

        return Response({
            'plan': plan,
            'amount': str(amount_value),
            'wallet_balance': str(wallet.balance),
            'subscription_status': profile.subscription_status,
        }, status=status.HTTP_201_CREATED)


class PaymentInitiateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        plan = (request.data.get('plan') or 'basic').strip().lower()
        provider = (request.data.get('provider') or 'paystack').strip().lower()
        if provider not in {'paystack', 'wema'}:
            return Response({'detail': 'Unsupported payment provider.'}, status=status.HTTP_400_BAD_REQUEST)
        amount = request.data.get('amount')

        try:
            amount_value = Decimal(str(amount))
        except Exception:
            return Response({'detail': 'A valid amount is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if amount_value <= 0:
            return Response({'detail': 'Amount must be greater than zero.'}, status=status.HTTP_400_BAD_REQUEST)

        reference = f"{provider}-{request.user.id}-{timezone.now().strftime('%Y%m%d%H%M%S%f')}"
        transaction = PaymentTransaction.objects.create(
            user=request.user,
            plan=plan,
            amount=amount_value,
            provider=provider,
            provider_reference=reference,
            status='PENDING',
        )

        paystack_secret_key = getattr(settings, 'PAYSTACK_SECRET_KEY', '').strip()
        paystack_public_key = getattr(settings, 'PAYSTACK_PUBLIC_KEY', '').strip()
        use_test_mode = getattr(settings, 'PAYSTACK_USE_TEST_MODE', True)

        if provider == 'paystack' and paystack_secret_key and paystack_public_key:
            try:
                response = requests.post(
                    'https://api.paystack.co/transaction/initialize',
                    headers={'Authorization': f'Bearer {paystack_secret_key}', 'Content-Type': 'application/json'},
                    json={
                        'email': request.user.email,
                        'amount': int(amount_value * 100),
                        'reference': reference,
                        'currency': 'NGN',
                        'channels': ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
                        'metadata': {'plan': plan, 'user_id': request.user.id},
                    },
                    timeout=10,
                )
                if response.ok:
                    payload = response.json().get('data', {})
                    transaction.provider_reference = payload.get('reference', reference)
                    transaction.save(update_fields=['provider_reference', 'updated_at'])
                    return Response({
                        'id': transaction.id,
                        'provider_reference': transaction.provider_reference,
                        'access_code': payload.get('access_code'),
                        'authorization_url': payload.get('authorization_url'),
                        'amount': str(amount_value),
                        'plan': plan,
                        'test_mode': use_test_mode,
                    }, status=status.HTTP_201_CREATED)
            except requests.RequestException:
                pass

        if provider == 'wema':
            payment_url = PaymentTransactionViewSet()._init_wema(request.user, transaction, reference, amount_value)
            if not payment_url and not getattr(settings, 'PAYSTACK_USE_TEST_MODE', False):
                transaction.delete()
                return Response({'detail': 'ALAT Pay is not configured or its payment session could not be created.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            return Response({
                'id': transaction.id,
                'provider_reference': transaction.provider_reference,
                'amount': str(amount_value),
                'plan': plan,
                'provider': provider,
                'payment_url': payment_url,
                'test_mode': getattr(settings, 'PAYSTACK_USE_TEST_MODE', False),
            }, status=status.HTTP_201_CREATED)

        return Response({
            'id': transaction.id,
            'provider_reference': reference,
            'amount': str(amount_value),
            'plan': plan,
            'provider': provider,
            'authorization_url': None,
            'test_mode': use_test_mode,
            'message': 'Paystack not configured; using local test-mode checkout flow.',
        }, status=status.HTTP_201_CREATED)


class PaymentVerifyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        reference = (request.data.get('reference') or '').strip()
        if not reference:
            return Response({'detail': 'A valid reference is required.'}, status=status.HTTP_400_BAD_REQUEST)

        transaction = PaymentTransaction.objects.filter(user=request.user, provider_reference=reference).first()
        if not transaction:
            return Response({'detail': 'Payment not found.'}, status=status.HTTP_404_NOT_FOUND)

        if transaction.status == 'SUCCESS':
            return Response(PaymentTransactionSerializer(transaction).data, status=status.HTTP_200_OK)

        paystack_secret_key = getattr(settings, 'PAYSTACK_SECRET_KEY', '').strip()
        use_test_mode = getattr(settings, 'PAYSTACK_USE_TEST_MODE', False)

        if use_test_mode or not paystack_secret_key:
            transaction.status = 'SUCCESS'
            transaction.save(update_fields=['status', 'updated_at'])
        else:
            try:
                response = requests.get(
                    f'https://api.paystack.co/transaction/verify/{reference}',
                    headers={'Authorization': f'Bearer {paystack_secret_key}'},
                    timeout=10,
                )
                if response.ok:
                    data = response.json().get('data', {})
                    if data.get('status') in {'success', 'settled'}:
                        transaction.status = 'SUCCESS'
                        transaction.save(update_fields=['status', 'updated_at'])
                    else:
                        return Response({'detail': 'Payment not completed yet.'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'detail': 'Failed to verify payment with Paystack.'}, status=status.HTTP_502_BAD_GATEWAY)
            except requests.RequestException:
                return Response({'detail': 'Payment verification service unavailable.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile.subscription_plan = transaction.plan
        profile.subscription_status = 'active'
        profile.subscription_expires_at = timezone.now() + timedelta(days=7)
        profile.save(update_fields=['subscription_plan', 'subscription_status', 'subscription_expires_at', 'updated_at'])

        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        wallet.credit(transaction.amount, reason=f"Subscription {transaction.plan}")
        # If this user was referred and the referral is confirmed but not yet rewarded,
        # credit the referrer with a one-time reward and mark the referral as rewarded.
        try:
            referral = Referral.objects.filter(referred_user=request.user, status='CONFIRMED', rewarded=False).first()
            if referral and referral.referrer:
                ref_wallet, _ = Wallet.objects.get_or_create(user=referral.referrer)
                ref_wallet.credit(Decimal('500.00'), reason=f"Referral reward for subscription {request.user.id}")
                referral.rewarded = True
                referral.save(update_fields=['rewarded'])
        except Exception:
            # avoid failing the verification flow if referral reward logic has issues
            pass
        return Response(PaymentTransactionSerializer(transaction).data, status=status.HTTP_200_OK)


class PaymentTransactionViewSet(viewsets.ViewSet):
    """Handle payment transaction endpoints for hostel rentals and other purchases"""
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """List user's payment transactions"""
        transactions = PaymentTransaction.objects.filter(user=request.user).order_by('-created_at')
        serializer = PaymentTransactionSerializer(transactions, many=True)
        return Response(serializer.data)

    def create(self, request):
        """Create a new payment for hostel rental or listing plan"""
        hostel_id = request.data.get('hostel_id')
        hostel_name = request.data.get('hostel_name', 'Hostel Rental')
        amount = request.data.get('amount')
        provider = request.data.get('provider', 'paystack')  # Can be 'paystack' or 'wema'
        plan = request.data.get('plan', 'hostel_yearly')

        try:
            amount_value = Decimal(str(amount))
        except Exception:
            return Response({'detail': 'A valid amount is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if amount_value <= 0:
            return Response({'detail': 'Amount must be greater than zero.'}, status=status.HTTP_400_BAD_REQUEST)

        reference = f"{provider}-{request.user.id}-{timezone.now().strftime('%Y%m%d%H%M%S')}"
        transaction = PaymentTransaction.objects.create(
            user=request.user,
            plan=plan,
            amount=amount_value,
            provider=provider,
            provider_reference=reference,
            status='PENDING',
        )

        # Initialize payment with chosen provider
        payment_url = None
        if provider == 'paystack':
            payment_url = self._init_paystack(request.user, transaction, reference, amount_value)
        elif provider == 'wema':
            payment_url = self._init_wema(request.user, transaction, reference, amount_value)

        return Response({
            'id': transaction.id,
            'provider_reference': reference,
            'amount': str(amount_value),
            'plan': plan,
            'payment_url': payment_url,
            'provider': provider,
        }, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        """Get a specific payment transaction"""
        try:
            transaction = PaymentTransaction.objects.get(id=pk, user=request.user)
            serializer = PaymentTransactionSerializer(transaction)
            return Response(serializer.data)
        except PaymentTransaction.DoesNotExist:
            return Response({'detail': 'Payment not found.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def send_receipt(self, request, pk=None):
        """Send receipt email for successful payment"""
        try:
            transaction = PaymentTransaction.objects.get(id=pk, user=request.user)
        except PaymentTransaction.DoesNotExist:
            return Response({'detail': 'Payment not found.'}, status=status.HTTP_404_NOT_FOUND)

        if transaction.status != 'SUCCESS':
            return Response({'detail': 'Only successful payments can send receipts.'}, status=status.HTTP_400_BAD_REQUEST)

        # Send receipt email
        try:
            subject = f'Payment Receipt - {transaction.plan.upper()} Plan'
            message = f"""
Hello {request.user.get_full_name() or request.user.username},

Your payment of ₦{transaction.amount:,.2f} has been confirmed.

Transaction Details:
- Reference ID: {transaction.provider_reference}
- Plan: {transaction.plan.upper()}
- Amount: ₦{transaction.amount:,.2f}
- Payment Method: {transaction.provider.upper()}
- Date: {transaction.created_at.strftime('%Y-%m-%d %H:%M:%S')}

Thank you for using AY'SMART!

Best regards,
AY'SMART Team
            """
            send_mail(subject, message, getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@resend.dev'), [request.user.email], fail_silently=False)
            return Response({'detail': 'Receipt sent to your email.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': f'Failed to send email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _init_paystack(self, user, transaction, reference, amount):
        """Initialize Paystack payment"""
        paystack_secret_key = getattr(settings, 'PAYSTACK_SECRET_KEY', '').strip()
        if not paystack_secret_key:
            return None

        try:
            response = requests.post(
                'https://api.paystack.co/transaction/initialize',
                headers={'Authorization': f'Bearer {paystack_secret_key}', 'Content-Type': 'application/json'},
                json={
                    'email': user.email,
                    'amount': int(amount * 100),
                    'reference': reference,
                    'currency': 'NGN',
                    'channels': ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
                    'metadata': {'plan': transaction.plan, 'user_id': user.id},
                },
                timeout=10,
            )
            if response.ok:
                payload = response.json().get('data', {})
                transaction.provider_reference = payload.get('reference', reference)
                transaction.save(update_fields=['provider_reference'])
                return payload.get('authorization_url')
        except requests.RequestException:
            pass
        return None

    def _init_wema(self, user, transaction, reference, amount):
        """Initialize Wema/Alat Pay payment"""
        wema_api_key = getattr(settings, 'WEMA_API_KEY', '').strip()
        if not wema_api_key:
            return None

        try:
            response = requests.post(
                'https://api.wema.ng/v1/transaction/initialize',  # placeholder URL
                headers={'Authorization': f'Bearer {wema_api_key}', 'Content-Type': 'application/json'},
                json={
                    'email': user.email,
                    'amount': int(amount),
                    'reference': reference,
                    'currency': 'NGN',
                    'description': transaction.plan,
                    'customer_name': user.get_full_name() or user.username,
                    'customer_phone': user.profile.phone if hasattr(user, 'profile') else '',
                },
                timeout=10,
            )
            if response.ok:
                payload = response.json().get('data', {})
                transaction.provider_reference = payload.get('reference', reference)
                transaction.save(update_fields=['provider_reference'])
                return payload.get('payment_url') or payload.get('checkout_url')
        except requests.RequestException:
            pass
        return None

