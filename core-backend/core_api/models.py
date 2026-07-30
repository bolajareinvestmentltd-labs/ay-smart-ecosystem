from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from decimal import Decimal

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
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class InspectionBooking(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending Walkthrough'),
        ('COMPLETED', 'Inspection Verified'),
        ('CANCELLED', 'Cancelled'),
    ]
    client_name = models.CharField(max_length=100)
    client_phone = models.CharField(max_length=20)
    property_to_view = models.ForeignKey(Property, on_delete=models.CASCADE)
    scheduled_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    payment_unlocked = models.BooleanField(default=False, help_text="Check to allow client to make online payment")

    def __str__(self):
        return f"Inspection: {self.property_to_view.title} by {self.client_name}"


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

    def debit(self, amount: Decimal, reason: str = ''):
        self.balance = (self.balance or Decimal('0.00')) - Decimal(amount)
        self.save()

    def __str__(self):
        return f"{self.user.username} - {self.balance} {self.currency}"


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


class SiteBrand(models.Model):
    name = models.CharField(max_length=100, default="AY'SMART")
    logo = models.ImageField(upload_to='branding/', blank=True, null=True, help_text='Primary brand logo (SVG/PNG)')
    logo_dark = models.ImageField(upload_to='branding/', blank=True, null=True, help_text='Optional dark variant')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
