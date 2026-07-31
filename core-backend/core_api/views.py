import os
from datetime import timedelta
from decimal import Decimal

from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

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
        return Response({'id': user.id, 'username': user.username, 'email': user.email, 'role': profile.role}, status=status.HTTP_201_CREATED)


class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({'id': user.id, 'username': user.username, 'email': user.email})


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
        return Response(PaymentTransactionSerializer(transaction).data, status=status.HTTP_201_CREATED)


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
