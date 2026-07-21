from rest_framework import serializers
from .models import (
    BranchLocation, Vehicle, PickupVoucher,
    Property, InspectionBooking,
    BuildProject, ProjectMilestone
)

class BranchLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BranchLocation
        fields = '__all__'

class VehicleSerializer(serializers.ModelSerializer):
    assigned_branch_details = BranchLocationSerializer(source='assigned_branch', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Vehicle
        fields = '__all__'

class PropertySerializer(serializers.ModelSerializer):
    property_type_display = serializers.CharField(source='get_property_type_display', read_only=True)

    class Meta:
        model = Property
        fields = '__all__'

class InspectionBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = InspectionBooking
        fields = '__all__'

class ProjectMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMilestone
        fields = '__all__'

class BuildProjectSerializer(serializers.ModelSerializer):
    milestones = ProjectMilestoneSerializer(many=True, read_only=True)

    class Meta:
        model = BuildProject
        fields = '__all__'
