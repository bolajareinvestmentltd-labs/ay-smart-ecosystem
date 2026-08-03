from datetime import datetime, time
from decimal import Decimal

from rest_framework import serializers
from .models import (
    BranchLocation, Vehicle, PickupVoucher,
    Property, InspectionBooking,
    BuildProject, ProjectMilestone
)
from .models import Listing, PaymentTransaction, Referral, SupportRequest, UserProfile, Wallet, WalletTransaction


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
    images = serializers.SerializerMethodField()

    def get_images(self, obj):
        imgs = getattr(obj, 'images').all()
        return [
            {
                'id': img.id,
                'url': img.image.url if getattr(img, 'image', None) else img.url,
                'caption': img.caption,
                'order': img.order,
            }
            for img in imgs
        ]

    class Meta:
        model = Property
        # expose lat/lng and images for frontend detail pages
        fields = ['id', 'title', 'property_type', 'property_type_display', 'price', 'location_address', 'latitude', 'longitude', 'is_for_lease', 'virtual_tour_url', 'main_image_url', 'is_available', 'images']

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


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone', 'location', 'role', 'subscription_plan', 'subscription_status', 'subscription_expires_at', 'is_kyc_verified', 'is_admin_approved', 'email_verified']


class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ['id', 'user', 'title', 'category', 'location', 'price', 'plan', 'duration_days', 'status', 'cashback', 'created_at']
        read_only_fields = ['id', 'user', 'cashback', 'created_at']

    def create(self, validated_data):
        amount = validated_data.get('price', 0)
        validated_data['cashback'] = amount * Decimal('0.10')
        return super().create(validated_data)


class ReferralSerializer(serializers.ModelSerializer):
    referrer_username = serializers.CharField(source='referrer.username', read_only=True)

    class Meta:
        model = Referral
        fields = ['id', 'referrer', 'referrer_username', 'referred_email', 'referred_user', 'status', 'created_at', 'confirmed_at', 'note']
        read_only_fields = ['id', 'status', 'created_at', 'confirmed_at']


class SupportRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportRequest
        fields = ['id', 'name', 'email', 'phone', 'category', 'subject', 'message', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']


class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = ['id', 'user', 'amount', 'kind', 'description', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class PaymentTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTransaction
        fields = ['id', 'user', 'plan', 'amount', 'provider', 'provider_reference', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'provider_reference', 'status', 'created_at', 'updated_at']
