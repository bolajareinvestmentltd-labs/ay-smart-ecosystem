from rest_framework import viewsets, permissions
from .models import (
    BranchLocation, Vehicle, PickupVoucher,
    Property, InspectionBooking, BuildProject
)
from .serializers import (
    BranchLocationSerializer, VehicleSerializer,
    PropertySerializer, InspectionBookingSerializer,
    BuildProjectSerializer
)

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
