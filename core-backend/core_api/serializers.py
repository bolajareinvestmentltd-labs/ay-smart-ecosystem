from datetime import datetime, time
from decimal import Decimal

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from rest_framework import serializers
from .models import (
    BranchLocation, Vehicle, PickupVoucher,
    Property, InspectionBooking, InspectionBookingMessage, PropertyImage,
    BuildProject, ProjectMilestone, Promotion, ListingImage,
    Listing, PaymentTransaction, InspectionInvoice, Notification, Referral, SupportRequest, UserProfile, Wallet, WalletTransaction,
    SavedSearch, FavoriteListing, HiddenListing, Conversation, ConversationMessage,
    HostelBooking, ServiceApartmentBooking,
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
    images = serializers.SerializerMethodField()

    def get_images(self, obj):
        request = self.context.get('request') if hasattr(self, 'context') else None

        def absolute_url(url):
            if not url:
                return url
            if request and url.startswith('/'):
                return request.build_absolute_uri(url)
            return url

        imgs = getattr(obj, 'images').all()
        return [
            {
                'id': img.id,
                'url': absolute_url(img.image.url if getattr(img, 'image', None) else img.url),
                'video_url': absolute_url(img.video.url) if getattr(img, 'video', None) else None,
                'caption': img.caption,
                'order': img.order,
            }
            for img in imgs
        ]

    class Meta:
        model = Property
        # expose lat/lng and images for frontend detail pages
        fields = ['id', 'title', 'property_type', 'property_type_display', 'price', 'location_address', 'latitude', 'longitude', 'is_for_lease', 'virtual_tour_url', 'main_image_url', 'is_available', 'images']

class InspectionBookingMessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.SerializerMethodField()

    class Meta:
        model = InspectionBookingMessage
        fields = ['id', 'sender', 'sender_username', 'sender_name', 'sender_role', 'text', 'created_at']
        read_only_fields = ['id', 'sender', 'sender_username', 'created_at']

    def get_sender_username(self, obj):
        return obj.sender.username if obj.sender else None


class PropertyImageUploadSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        video = attrs.get('video')
        if video:
            if video.size > 50 * 1024 * 1024:
                raise serializers.ValidationError({'video': 'Each video must be 50 MB or smaller.'})
            if video.content_type not in {'video/mp4', 'video/webm', 'video/quicktime'}:
                raise serializers.ValidationError({'video': 'Videos must be MP4, WebM, or MOV files.'})
        if not attrs.get('image') and not video:
            raise serializers.ValidationError('Upload an image or a video.')
        return attrs

    class Meta:
        model = PropertyImage
        fields = ['id', 'property', 'image', 'video', 'caption', 'order']
        read_only_fields = ['id', 'property']

class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = '__all__'


class InspectionBookingSerializer(serializers.ModelSerializer):
    property = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all(),
        write_only=True,
        source='property_to_view',
        required=False,
    )
    listing = serializers.PrimaryKeyRelatedField(queryset=Listing.objects.filter(status='LIVE'), required=False, allow_null=True)
    preferred_date = serializers.DateField(write_only=True)
    assigned_agent_username = serializers.CharField(source='assigned_agent.username', read_only=True)
    messages = InspectionBookingMessageSerializer(many=True, read_only=True)
    contact_released = serializers.BooleanField(read_only=True)
    agent_contact = serializers.SerializerMethodField()
    listing_title = serializers.SerializerMethodField()

    def get_listing_title(self, obj):
        return obj.listing.title if obj.listing else obj.property_to_view.title

    def get_agent_contact(self, obj):
        if obj.contact_released and obj.assigned_agent:
            return obj.assigned_agent.profile.phone
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        user = request.user if request else None
        if not user or not user.is_staff and user not in {instance.client_user, instance.assigned_agent}:
            for field in ('inspection_latitude', 'inspection_longitude', 'inspection_location_accuracy', 'location_consented_at'):
                data.pop(field, None)
        return data

    class Meta:
        model = InspectionBooking
        fields = [
            'id', 'client_user', 'client_name', 'client_phone', 'client_confirmed', 'agent_confirmed',
            'assigned_agent', 'assigned_agent_username', 'agent_contact', 'agent_response', 'property', 'preferred_date',
            'listing', 'listing_title', 'location_consent', 'inspection_latitude', 'inspection_longitude', 'inspection_location_accuracy', 'location_consented_at',
            'status', 'payment_unlocked', 'scheduled_date', 'admin_approved', 'contact_released',
            'agreed_date', 'agreed_time', 'messages',
        ]
        read_only_fields = ['id', 'scheduled_date', 'payment_unlocked', 'messages', 'assigned_agent_username', 'client_user', 'location_consented_at']

    def create(self, validated_data):
        preferred_date = validated_data.pop('preferred_date')
        validated_data['scheduled_date'] = datetime.combine(preferred_date, time.min)

        if not validated_data.get('property_to_view') and not validated_data.get('listing'):
            raise serializers.ValidationError({'listing': 'A live listing is required for new inspections.'})

        if validated_data.get('location_consent') and (
            validated_data.get('inspection_latitude') is None or validated_data.get('inspection_longitude') is None
        ):
            raise serializers.ValidationError({'inspection_latitude': 'Both coordinates are required when location sharing is enabled.'})
        if validated_data.get('location_consent'):
            validated_data['location_consented_at'] = timezone.now()

        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            validated_data['client_user'] = request.user

        assigned_agent = self.assign_agent(validated_data.get('listing'))
        validated_data['assigned_agent'] = assigned_agent
        if assigned_agent:
            validated_data['status'] = 'AGENT_OFFERED'

        booking = super().create(validated_data)
        if assigned_agent and assigned_agent.email:
            subject = 'New Inspection Booking Assigned'
            message = (
                f"Hello {assigned_agent.get_full_name() or assigned_agent.username},\n\n"
                f"A new inspection booking has been created for {booking.listing.title if booking.listing else booking.property_to_view.title}.\n"
                f"Client: {booking.client_name}\n"
                f"Phone: {booking.client_phone}\n"
                "Please respond with your availability in the admin portal.\n\n"
                "Thank you,\nAY'SMART"
            )
            try:
                send_mail(subject, message, getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@resend.dev'), [assigned_agent.email], fail_silently=True)
            except Exception:
                pass
        return booking

    def assign_agent(self, listing=None):
        if listing and listing.user.profile.role in {'agent', 'seller', 'both'} and listing.user.profile.is_admin_approved:
            return listing.user
        agent_profile = UserProfile.objects.filter(role__in=['agent', 'both'], is_admin_approved=True).order_by('user__id').first()
        return agent_profile.user if agent_profile else None

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
    identity_document = serializers.FileField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = UserProfile
        fields = [
            'phone', 'location', 'role', 'subscription_plan', 'subscription_status', 'subscription_expires_at',
            'is_kyc_verified', 'is_admin_approved', 'kyc_status', 'kyc_provider', 'kyc_reference', 'kyc_face_match_score', 'kyc_verified_at', 'identity_document_type', 'identity_document_number', 'identity_document', 'kyc_rejection_reason', 'email_verified',
            'student_matric_number', 'student_email', 'student_id_image',
        ]


class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ['id', 'image', 'video', 'caption', 'order']
        read_only_fields = ['id']


class ListingSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()

    def get_images(self, obj):
        request = self.context.get('request') if hasattr(self, 'context') else None

        def absolute_url(url):
            if not url:
                return url
            if request and url.startswith('/'):
                return request.build_absolute_uri(url)
            return url

        return [
            {
                'id': image.id,
                'url': absolute_url(image.image.url if getattr(image, 'image', None) else ''),
                'video_url': absolute_url(image.video.url) if getattr(image, 'video', None) else None,
                'caption': image.caption,
                'order': image.order,
            }
            for image in obj.images.all()
        ]

    class Meta:
        model = Listing
        fields = ['id', 'user', 'title', 'category', 'description', 'location', 'price', 'facilities', 'plan', 'duration_days', 'duration_unit', 'service_fee', 'map_url', 'status', 'cashback', 'created_at', 'images']
        read_only_fields = ['id', 'user', 'cashback', 'created_at']

    def create(self, validated_data):
        amount = validated_data.get('price', 0)
        validated_data['cashback'] = amount * Decimal('0.10')
        return super().create(validated_data)


class SavedSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedSearch
        fields = ['id', 'user', 'name', 'location', 'property_type', 'min_price', 'max_price', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class FavoriteListingSerializer(serializers.ModelSerializer):
    listing_details = ListingSerializer(source='listing', read_only=True)
    listing_title = serializers.CharField(source='listing.title', read_only=True)
    listing_location = serializers.CharField(source='listing.location', read_only=True)

    class Meta:
        model = FavoriteListing
        fields = ['id', 'user', 'listing', 'listing_details', 'listing_title', 'listing_location', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class HiddenListingSerializer(serializers.ModelSerializer):
    listing_title = serializers.CharField(source='listing.title', read_only=True)

    class Meta:
        model = HiddenListing
        fields = ['id', 'user', 'listing', 'listing_title', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class ConversationMessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = ConversationMessage
        fields = ['id', 'conversation', 'sender', 'sender_username', 'sender_name', 'text', 'created_at']
        read_only_fields = ['id', 'conversation', 'sender', 'sender_username', 'created_at']


class ConversationSerializer(serializers.ModelSerializer):
    messages = ConversationMessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'user', 'listing', 'subject', 'status', 'created_at', 'updated_at', 'messages']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'messages']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        conversation = super().create(validated_data)
        text = self.context.get('request').data.get('message') if self.context.get('request') else ''
        if text:
            ConversationMessage.objects.create(
                conversation=conversation,
                sender=request.user if request and request.user.is_authenticated else None,
                sender_name=(request.user.get_full_name() or request.user.username) if request and request.user.is_authenticated else 'Guest',
                text=text,
            )
        return conversation


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


class HostelBookingSerializer(serializers.ModelSerializer):
    listing_title = serializers.CharField(source='listing.title', read_only=True)
    listing_price = serializers.DecimalField(source='listing.price', read_only=True, max_digits=12, decimal_places=2)

    class Meta:
        model = HostelBooking
        fields = [
            'id', 'listing', 'listing_title', 'listing_price', 'student', 'student_name', 'student_email', 'student_phone',
            'check_in_date', 'check_out_date', 'total_amount', 'service_fee', 'payment_reference',
            'status', 'admin_approved', 'funds_released', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'payment_reference', 'listing_title', 'listing_price']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['student'] = request.user
        return super().create(validated_data)


class ServiceApartmentBookingSerializer(serializers.ModelSerializer):
    listing_title = serializers.CharField(source='listing.title', read_only=True)
    listing_price = serializers.DecimalField(source='listing.price', read_only=True, max_digits=12, decimal_places=2)

    class Meta:
        model = ServiceApartmentBooking
        fields = [
            'id', 'listing', 'listing_title', 'listing_price', 'tenant', 'tenant_name', 'tenant_email', 'tenant_phone',
            'check_in_date', 'duration_days', 'total_amount', 'service_fee', 'payment_reference',
            'status', 'admin_approved', 'funds_released', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'payment_reference', 'listing_title', 'listing_price']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['tenant'] = request.user
        return super().create(validated_data)


class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = ['id', 'user', 'amount', 'kind', 'description', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class PaymentTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTransaction
        fields = ['id', 'user', 'invoice', 'plan', 'amount', 'provider', 'provider_reference', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'provider_reference', 'status', 'created_at', 'updated_at']


class InspectionInvoiceSerializer(serializers.ModelSerializer):
    inspection_title = serializers.SerializerMethodField()

    def get_inspection_title(self, obj):
        return obj.inspection.listing.title if obj.inspection.listing else obj.inspection.property_to_view.title

    class Meta:
        model = InspectionInvoice
        fields = ['id', 'inspection', 'issuer', 'recipient', 'invoice_number', 'amount', 'description', 'status', 'inspection_title', 'created_at', 'paid_at']
        read_only_fields = ['id', 'issuer', 'recipient', 'invoice_number', 'status', 'inspection_title', 'created_at', 'paid_at']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'kind', 'title', 'message', 'link', 'is_read', 'created_at']
        read_only_fields = ['id', 'created_at']
