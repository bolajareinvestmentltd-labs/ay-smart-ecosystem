from datetime import datetime, time

from rest_framework import serializers
from .models import (
    BranchLocation, Vehicle, PickupVoucher,
    Property, InspectionBooking,
    BuildProject, ProjectMilestone
)
from .models import Referral, Wallet


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
    property = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all(),
        write_only=True,
        source='property_to_view',
    )
    preferred_date = serializers.DateField(write_only=True)

    class Meta:
        model = InspectionBooking
        fields = ['id', 'client_name', 'client_phone', 'property', 'preferred_date', 'status', 'payment_unlocked', 'scheduled_date']
        read_only_fields = ['id', 'scheduled_date', 'payment_unlocked']

    def create(self, validated_data):
        preferred_date = validated_data.pop('preferred_date')
        validated_data['scheduled_date'] = datetime.combine(preferred_date, time.min)
        return super().create(validated_data)

class ProjectMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMilestone
        fields = '__all__'

class BuildProjectSerializer(serializers.ModelSerializer):
    milestones = ProjectMilestoneSerializer(many=True, read_only=True)

    class Meta:
        model = BuildProject
        fields = '__all__'


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['user', 'balance', 'currency']


class ReferralSerializer(serializers.ModelSerializer):
    referrer_username = serializers.CharField(source='referrer.username', read_only=True)

    class Meta:
        model = Referral
        fields = ['id', 'referrer', 'referrer_username', 'referred_email', 'referred_user', 'status', 'created_at', 'confirmed_at', 'note']
        read_only_fields = ['id', 'status', 'created_at', 'confirmed_at']
