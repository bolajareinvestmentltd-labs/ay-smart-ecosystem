import os
from rest_framework import viewsets, permissions
from django.contrib.auth.models import User
from .models import (
    BranchLocation, Vehicle, PickupVoucher,
    Property, InspectionBooking, BuildProject
)
from .serializers import (
    BranchLocationSerializer, VehicleSerializer,
    PropertySerializer, InspectionBookingSerializer,
    BuildProjectSerializer
)
from .serializers import ReferralSerializer, WalletSerializer
from .models import Referral, Wallet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from decimal import Decimal
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView


class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({'id': user.id, 'username': user.username, 'email': user.email})

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


class ReferralViewSet(viewsets.ModelViewSet):
    queryset = Referral.objects.all().order_by('-created_at')
    serializer_class = ReferralSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        # Accepts { email | referred_email, referrer (optional user id) }
        data = request.data.copy()
        # support frontend using either `email` or `referred_email`
        if 'email' in data and 'referred_email' not in data:
            data['referred_email'] = data.pop('email')

        referrer_id = data.get('referrer') or None
        if referrer_id:
            try:
                ref_user = User.objects.get(pk=int(referrer_id))
                data['referrer'] = ref_user.id
            except Exception:
                data['referrer'] = None

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

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


class WalletViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Wallet.objects.all()
    serializer_class = WalletSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        try:
            wallet = Wallet.objects.get(user=request.user)
        except Wallet.DoesNotExist:
            return Response({'detail': 'Wallet not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(wallet)
        return Response(serializer.data)
