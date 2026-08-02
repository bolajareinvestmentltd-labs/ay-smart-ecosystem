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
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import SimpleRateThrottle
import hashlib
import hmac
import base64
import logging
from django.conf import settings

from .models import (
    BranchLocation, BuildProject, InspectionBooking,
    Listing, PaymentTransaction, PickupVoucher, Property, SupportRequest, UserProfile,
    Vehicle, Wallet, WalletTransaction
)
from .serializers import (
    BranchLocationSerializer, VehicleSerializer,
    PropertySerializer, InspectionBookingSerializer,
    BuildProjectSerializer
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
            profile.save()

        Wallet.objects.get_or_create(user=user)
        try:
            send_verification_email(user)
        except Exception as exc:
            # Keep registration successful but surface an error if email delivery is not configured.
            return Response(
                {'detail': 'User created, but verification email could not be sent. Check email configuration.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response({'id': user.id, 'username': user.username, 'email': user.email, 'role': profile.role}, status=status.HTTP_201_CREATED)


class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]
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
        profile.is_kyc_verified = True
        profile.is_admin_approved = True
        profile.save()
        return Response(UserProfileSerializer(profile).data, status=status.HTTP_200_OK)


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

class InspectionBookingViewSet(viewsets.ModelViewSet):
    queryset = InspectionBooking.objects.all().order_by('-id')
    serializer_class = InspectionBookingSerializer
    permission_classes = [permissions.AllowAny]

class BuildProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BuildProject.objects.all()
    serializer_class = BuildProjectSerializer
    permission_classes = [permissions.IsAuthenticated]


class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.all().order_by('-id')
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Listing.objects.all().order_by('-id')
        return Listing.objects.filter(user=self.request.user).order_by('-id')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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
        amount = request.data.get('amount')

        try:
            amount_value = Decimal(str(amount))
        except Exception:
            return Response({'detail': 'A valid amount is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if amount_value <= 0:
            return Response({'detail': 'Amount must be greater than zero.'}, status=status.HTTP_400_BAD_REQUEST)

        reference = f"paystack-{request.user.id}-{timezone.now().strftime('%Y%m%d%H%M%S')}"
        transaction = PaymentTransaction.objects.create(
            user=request.user,
            plan=plan,
            amount=amount_value,
            provider='paystack',
            provider_reference=reference,
            status='PENDING',
        )

        paystack_secret_key = os.getenv('PAYSTACK_SECRET_KEY', '').strip()
        paystack_public_key = os.getenv('PAYSTACK_PUBLIC_KEY', '').strip()
        use_test_mode = os.getenv('PAYSTACK_USE_TEST_MODE', 'true').lower() in {'1', 'true', 'yes', 'on'}

        if paystack_secret_key and paystack_public_key:
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

        return Response({
            'id': transaction.id,
            'provider_reference': reference,
            'amount': str(amount_value),
            'plan': plan,
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

        transaction.status = 'SUCCESS'
        transaction.save(update_fields=['status', 'updated_at'])

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
