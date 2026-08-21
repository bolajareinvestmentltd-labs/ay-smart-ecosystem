from datetime import timedelta
from decimal import Decimal

from django.conf import settings
from django.contrib.auth.models import User
from django.core.files.storage import default_storage
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

try:
    from cloudinary_storage.storage import VideoMediaCloudinaryStorage
except ImportError:
    VideoMediaCloudinaryStorage = None

VIDEO_STORAGE = (
    VideoMediaCloudinaryStorage()
    if VideoMediaCloudinaryStorage and settings.CLOUDINARY_STORAGE.get('CLOUD_NAME')
    else default_storage
)

# ==========================================
# 1. AUTOMOTIVE DIVISION MODELS
# ==========================================
class BranchLocation(models.Model):
    name = models.CharField(max_length=100, help_text="e.g., Victoria Island Branch")
    address = models.TextField()
    contact_phone = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Vehicle(models.Model):
    STATUS_CHOICES = [
        ('AVAILABLE', 'Available for Sale/Hire'),
        ('HIRED', 'Currently on Hire/Lease'),
        ('SOLD', 'Sold Out'),
        ('MAINTENANCE', 'In Maintenance'),
    ]
    title = models.CharField(max_length=150, help_text="e.g., 2024 Mercedes-Benz G63 AMG")
    brand = models.CharField(max_length=50)
    model_year = models.PositiveIntegerField()
    outright_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    daily_hire_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')
    assigned_branch = models.ForeignKey(BranchLocation, on_delete=models.SET_NULL, null=True)
    main_image_url = models.URLField(help_text="URL for the landing carousel image")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"

class PickupVoucher(models.Model):
    client_name = models.CharField(max_length=100)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    pickup_branch = models.ForeignKey(BranchLocation, on_delete=models.CASCADE)
    qr_code_string = models.CharField(max_length=100, unique=True)
    is_scanned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Voucher #{self.id} - {self.client_name}"


# ==========================================
# 2. REAL ESTATE DIVISION MODELS
# ==========================================
class Property(models.Model):
    TYPE_CHOICES = [
        ('LAND', 'Landed Property'),
        ('RESIDENTIAL', 'Residential House / Duplex'),
        ('COMMERCIAL', 'Commercial Building'),
    ]
    title = models.CharField(max_length=200, help_text="e.g., 500sqm Beachfront Land, Lekki")
    property_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    price = models.DecimalField(max_digits=15, decimal_places=2)
    location_address = models.TextField()
    is_for_lease = models.BooleanField(default=False, help_text="Check if available for rent/lease")
    virtual_tour_url = models.URLField(blank=True, null=True, help_text="360 Virtual Tour Link")
    main_image_url = models.URLField()
    # Optional geolocation for map linking (latitude / longitude)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='property_images/', blank=True, null=True)
    video = models.FileField(upload_to='property_videos/', storage=VIDEO_STORAGE, blank=True, null=True)
    url = models.URLField(blank=True, null=True, help_text='Fallback image URL when media file is not available')
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0, help_text='Lower values appear first')

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        title = self.property.title
        filename = self.image.name if self.image else self.url or 'unassigned image'
        return f"Image for {title} ({filename})"

class Promotion(models.Model):
    AUDIENCE_CHOICES = [
        ('all', 'All visitors'),
        ('student', 'Students'),
        ('agent', 'Agents'),
        ('buyer', 'Buyers'),
    ]

    title = models.CharField(max_length=120, help_text='Short promo title')
    subtitle = models.CharField(max_length=180, blank=True, help_text='Brief supporting copy')
    discount_text = models.CharField(max_length=80, help_text='Offer text such as 5% off or First 50 students', default='5% off')
    cta_text = models.CharField(max_length=40, default='Learn more')
    target_url = models.URLField(blank=True, null=True, help_text='Optional target URL for the promo action')
    is_active = models.BooleanField(default=True)
    audience = models.CharField(max_length=20, choices=AUDIENCE_CHOICES, default='all')
    display_order = models.PositiveIntegerField(default=0, help_text='Lower values appear first in the carousel')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', '-updated_at']

    def __str__(self):
        return f"{self.title} ({self.discount_text})"

class InspectionBooking(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending Walkthrough'),
        ('AGENT_OFFERED', 'Agent Offered'),
        ('CONFIRMED', 'Confirmed by Agent'),
        ('AWAITING_ADMIN', 'Awaiting Admin Approval'),
        ('COMPLETED', 'Inspection Verified'),
        ('CANCELLED', 'Cancelled'),
    ]
    RESPONSE_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
    ]

    client_user = models.ForeignKey(User, related_name='inspection_requests', null=True, blank=True, on_delete=models.SET_NULL)
    client_name = models.CharField(max_length=100)
    client_phone = models.CharField(max_length=20)
    property_to_view = models.ForeignKey(Property, on_delete=models.CASCADE)
    scheduled_date = models.DateTimeField()
    assigned_agent = models.ForeignKey(User, related_name='assigned_inspections', null=True, blank=True, on_delete=models.SET_NULL)
    agent_response = models.CharField(max_length=20, choices=RESPONSE_CHOICES, default='PENDING')
    client_confirmed = models.BooleanField(default=False)
    agent_confirmed = models.BooleanField(default=False)
    admin_approved = models.BooleanField(default=False)
    contact_released = models.BooleanField(default=False)
    agreed_date = models.DateField(null=True, blank=True)
    agreed_time = models.TimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    payment_unlocked = models.BooleanField(default=False, help_text="Check to allow client to make online payment")
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return f"Inspection: {self.property_to_view.title} by {self.client_name}"


class InspectionBookingMessage(models.Model):
    ROLE_CHOICES = [
        ('CLIENT', 'Client'),
        ('AGENT', 'Agent'),
        ('ADMIN', 'Admin'),
    ]

    booking = models.ForeignKey(InspectionBooking, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    sender_name = models.CharField(max_length=100, blank=True)
    sender_role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CLIENT')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message by {self.sender_name or self.sender_id or 'Unknown'} on {self.booking}"


# ==========================================
# 3. BUILD PROGRESS TRACKER (CLIENT PORTAL)
# ==========================================
class BuildProject(models.Model):
    client_name = models.CharField(max_length=100)
    project_title = models.CharField(max_length=200, help_text="e.g., 4-Bedroom Duplex Construction - Alhaji Musa")
    total_budget = models.DecimalField(max_digits=15, decimal_places=2)
    current_phase = models.CharField(max_length=100, help_text="e.g., Foundation & Roofing")
    progress_percentage = models.PositiveIntegerField(default=0, help_text="Enter a value from 0 to 100")
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.project_title} ({self.progress_percentage}% Complete)"

class ProjectMilestone(models.Model):
    project = models.ForeignKey(BuildProject, related_name='milestones', on_delete=models.CASCADE)
    title = models.CharField(max_length=150, help_text="e.g., Phase 1: Foundation Laying")
    is_completed = models.BooleanField(default=False)
    site_photo_url = models.URLField(blank=True, null=True, help_text="Upload latest on-site construction photo")
    completion_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.project.project_title} - {self.title}"


# ==========================================
# 4. REFERRALS & WALLET
# ==========================================
class Wallet(models.Model):
    user = models.OneToOneField(User, related_name='wallet', on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    currency = models.CharField(max_length=6, default='NGN')

    def credit(self, amount: Decimal, reason: str = ''):
        self.balance = (self.balance or Decimal('0.00')) + Decimal(amount)
        self.save()
        WalletTransaction.objects.create(user=self.user, amount=amount, kind='CREDIT', description=reason or 'Wallet credit')

    def debit(self, amount: Decimal, reason: str = ''):
        self.balance = (self.balance or Decimal('0.00')) - Decimal(amount)
        self.save()
        WalletTransaction.objects.create(user=self.user, amount=-abs(Decimal(amount)), kind='DEBIT', description=reason or 'Wallet debit')

    def __str__(self):
        return f"{self.user.username} - {self.balance} {self.currency}"


class WalletTransaction(models.Model):
    KIND_CHOICES = [
        ('CREDIT', 'Credit'),
        ('DEBIT', 'Debit'),
    ]

    user = models.ForeignKey(User, related_name='wallet_transactions', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    kind = models.CharField(max_length=10, choices=KIND_CHOICES)
    description = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} {self.kind} {self.amount}"


class PaymentTransaction(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
    ]

    user = models.ForeignKey(User, related_name='payment_transactions', on_delete=models.CASCADE)
    plan = models.CharField(max_length=20, default='basic')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    provider = models.CharField(max_length=20, default='paystack')
    provider_reference = models.CharField(max_length=120, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} {self.plan} {self.status}"


class UserProfile(models.Model):
    KYC_STATUS_CHOICES = [
        ('NOT_STARTED', 'Not started'),
        ('PENDING', 'Pending admin review'),
        ('VERIFIED', 'Verified'),
        ('REJECTED', 'Rejected'),
    ]
    ROLE_CHOICES = [
        ('seller', 'Seller'),
        ('student', 'Student'),
        ('agent', 'Agent'),
        ('both', 'Seller + Student'),
    ]

    user = models.OneToOneField(User, related_name='profile', on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=200, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='seller')
    subscription_plan = models.CharField(max_length=20, default='basic')
    subscription_status = models.CharField(max_length=20, default='none')
    subscription_expires_at = models.DateTimeField(null=True, blank=True)
    is_kyc_verified = models.BooleanField(default=False)
    is_admin_approved = models.BooleanField(default=False)
    kyc_status = models.CharField(max_length=20, choices=KYC_STATUS_CHOICES, default='NOT_STARTED')
    kyc_provider = models.CharField(max_length=40, blank=True)
    kyc_reference = models.CharField(max_length=120, blank=True)
    kyc_rejection_reason = models.TextField(blank=True)
    email_verified = models.BooleanField(default=False)  # Added email verification field
    # Timestamp the last time a verification email was sent (for server-side cooldown)
    last_verification_sent_at = models.DateTimeField(null=True, blank=True)
    # Flag set when provider reports a hard bounce for this email
    email_bounced = models.BooleanField(default=False)
    student_matric_number = models.CharField(max_length=100, blank=True)
    student_email = models.EmailField(blank=True)
    student_id_image = models.ImageField(upload_to='student_id_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} profile"


class Listing(models.Model):
    CATEGORY_CHOICES = [
        ('Property', 'Property'),
        ('Landed Property', 'Landed Property'),
        ('Completed Building', 'Completed Building'),
        ('Uncompleted Building', 'Uncompleted Building'),
        ('Residential House', 'Residential House'),
        ('Duplex', 'Duplex'),
        ('Apartment', 'Apartment'),
        ('Service Apartment', 'Service Apartment'),
        ('Hostel', 'Hostel'),
        ('Commercial Property', 'Commercial Property'),
        ('Build from Scratch', 'Build from Scratch'),
        ('Automotive', 'Automotive'),
    ]
    DURATION_UNIT_CHOICES = [
        ('year', 'Per year'),
        ('day', 'Per day'),
        ('week', 'Per week'),
        ('month', 'Per month'),
    ]
    PLAN_CHOICES = [
        ('basic', 'Basic'),
        ('standard', 'Standard'),
        ('premium', 'Premium'),
    ]
    STATUS_CHOICES = [
        ('PENDING', 'Pending Review'),
        ('LIVE', 'Live'),
        ('REJECTED', 'Rejected'),
    ]

    user = models.ForeignKey(User, related_name='listings', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=40, choices=CATEGORY_CHOICES, default='Residential House')
    description = models.TextField(blank=True)
    location = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    facilities = models.JSONField(default=list, blank=True)
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='basic')
    duration_days = models.PositiveIntegerField(default=30)
    duration_unit = models.CharField(max_length=10, choices=DURATION_UNIT_CHOICES, default='month')
    service_fee = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('1500.00'))
    map_url = models.URLField(blank=True, help_text='Google Maps link for inspection or location verification')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    cashback = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class ListingImage(models.Model):
    listing = models.ForeignKey(Listing, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='listing_images/', blank=True, null=True)
    video = models.FileField(upload_to='listing_videos/', storage=VIDEO_STORAGE, blank=True, null=True)
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"Image for {self.listing.title}"


class HostelBooking(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending Payment'),
        ('PAID', 'Payment Received'),
        ('CONFIRMED', 'Confirmed'),
        ('ACTIVE', 'Active Stay'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    listing = models.ForeignKey(Listing, related_name='hostel_bookings', on_delete=models.CASCADE, limit_choices_to={'category': 'Hostel'})
    student = models.ForeignKey(User, related_name='hostel_bookings', on_delete=models.CASCADE)
    student_name = models.CharField(max_length=100)
    student_email = models.EmailField()
    student_phone = models.CharField(max_length=20)
    check_in_date = models.DateField()
    check_out_date = models.DateField(null=True, blank=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    service_fee = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('1500.00'))
    payment_reference = models.CharField(max_length=120, unique=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    admin_approved = models.BooleanField(default=False)
    funds_released = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Hostel booking: {self.listing.title} by {self.student_name}"


class ServiceApartmentBooking(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending Payment'),
        ('PAID', 'Payment Received'),
        ('CONFIRMED', 'Confirmed'),
        ('ACTIVE', 'Active Tenancy'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    listing = models.ForeignKey(Listing, related_name='apartment_bookings', on_delete=models.CASCADE, limit_choices_to={'category': 'Service Apartment'})
    tenant = models.ForeignKey(User, related_name='apartment_bookings', on_delete=models.CASCADE)
    tenant_name = models.CharField(max_length=100)
    tenant_email = models.EmailField()
    tenant_phone = models.CharField(max_length=20)
    check_in_date = models.DateField()
    duration_days = models.PositiveIntegerField()
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    service_fee = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('1500.00'))
    payment_reference = models.CharField(max_length=120, unique=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    admin_approved = models.BooleanField(default=False)
    funds_released = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Service apartment booking: {self.listing.title} by {self.tenant_name}"


class SavedSearch(models.Model):
    user = models.ForeignKey(User, related_name='saved_searches', on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    location = models.CharField(max_length=200, blank=True)
    property_type = models.CharField(max_length=30, blank=True)
    min_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    max_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.user.username}: {self.name}"


class FavoriteListing(models.Model):
    user = models.ForeignKey(User, related_name='favorite_listings', on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, related_name='favorited_by', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'listing')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} likes {self.listing.title}"


class HiddenListing(models.Model):
    user = models.ForeignKey(User, related_name='hidden_listings', on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, related_name='hidden_by', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'listing')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} hid {self.listing.title}"


class Conversation(models.Model):
    STATUS_CHOICES = [
        ('NEW', 'New'),
        ('REPLIED', 'Replied'),
        ('RESOLVED', 'Resolved'),
    ]

    user = models.ForeignKey(User, related_name='conversations', on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, related_name='conversations', on_delete=models.SET_NULL, null=True, blank=True)
    subject = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NEW')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.subject} ({self.user.username})"


class ConversationMessage(models.Model):
    conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name='conversation_messages', on_delete=models.SET_NULL, null=True, blank=True)
    sender_name = models.CharField(max_length=120, blank=True)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Message in {self.conversation.subject}"


class Referral(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('REJECTED', 'Rejected'),
    ]

    referrer = models.ForeignKey(User, related_name='sent_referrals', on_delete=models.SET_NULL, null=True, blank=True)
    referred_email = models.EmailField()
    referred_user = models.ForeignKey(User, related_name='referred_by', on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    note = models.TextField(blank=True, null=True)
    rewarded = models.BooleanField(default=False)

    def confirm(self):
        if self.status == 'CONFIRMED':
            return
        self.status = 'CONFIRMED'
        self.confirmed_at = timezone.now()
        self.save()
        # credit the referrer's wallet
        if self.referrer:
            wallet, _ = Wallet.objects.get_or_create(user=self.referrer)
            wallet.credit(Decimal('200.00'), reason=f"Referral {self.id}")

    def __str__(self):
        return f"Referral {self.id} -> {self.referred_email} ({self.status})"


@receiver(post_save, sender=User)
def manage_user_wallet_and_referrals(sender, instance, created, **kwargs):
    if not created:
        return

    UserProfile.objects.get_or_create(user=instance)
    Wallet.objects.get_or_create(user=instance)

    if not instance.email:
        return

    pending_referrals = Referral.objects.filter(
        referred_email__iexact=instance.email,
        status='PENDING',
    )
    for referral in pending_referrals:
        referral.referred_user = instance
        referral.confirm()


class SupportRequest(models.Model):
    CATEGORY_CHOICES = [
        ('complaint', 'Complaint'),
        ('inquiry', 'Inquiry'),
        ('request', 'Service Request'),
    ]

    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='inquiry')
    subject = models.CharField(max_length=160)
    message = models.TextField()
    status = models.CharField(max_length=20, default='NEW')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.subject} ({self.get_category_display()})"


class SiteBrand(models.Model):
    name = models.CharField(max_length=100, default="AY'SMART")
    logo = models.ImageField(upload_to='branding/', blank=True, null=True, help_text='Primary brand logo (SVG/PNG)')
    logo_dark = models.ImageField(upload_to='branding/', blank=True, null=True, help_text='Optional dark variant')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
