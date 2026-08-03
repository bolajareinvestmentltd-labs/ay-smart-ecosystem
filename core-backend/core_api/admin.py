from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import (
    BranchLocation, Vehicle, PickupVoucher,
    Property, InspectionBooking,
    PropertyImage,
    BuildProject, ProjectMilestone
)
from .models import Referral, SupportRequest, Wallet, SiteBrand

# --- AUTOMOTIVE ADMIN ---
@admin.register(BranchLocation)
class BranchLocationAdmin(ModelAdmin):
    list_display = ('name', 'contact_phone', 'is_active')
    list_filter = ('is_active',)

@admin.register(Vehicle)
class VehicleAdmin(ModelAdmin):
    list_display = ('title', 'brand', 'model_year', 'outright_price', 'daily_hire_rate', 'status', 'assigned_branch')
    list_filter = ('status', 'brand', 'assigned_branch')
    search_fields = ('title', 'brand')

@admin.register(PickupVoucher)
class PickupVoucherAdmin(ModelAdmin):
    list_display = ('client_name', 'vehicle', 'pickup_branch', 'qr_code_string', 'is_scanned', 'created_at')
    list_filter = ('is_scanned', 'pickup_branch')
    search_fields = ('client_name', 'qr_code_string')


# --- REAL ESTATE ADMIN ---

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1

@admin.register(Property)
class PropertyAdmin(ModelAdmin):
    list_display = ('title', 'property_type', 'price', 'is_for_lease', 'is_available')
    list_filter = ('property_type', 'is_for_lease', 'is_available')
    search_fields = ('title', 'location_address')
    inlines = [PropertyImageInline]

admin.site.register(PropertyImage)
@admin.register(InspectionBooking)
class InspectionBookingAdmin(ModelAdmin):
    list_display = ('client_name', 'client_phone', 'property_to_view', 'scheduled_date', 'status', 'payment_unlocked')
    list_filter = ('status', 'payment_unlocked', 'scheduled_date')
    search_fields = ('client_name', 'client_phone')


# --- BUILD TRACKER ADMIN ---
class ProjectMilestoneInline(admin.TabularInline):
    model = ProjectMilestone
    extra = 1

@admin.register(BuildProject)
class BuildProjectAdmin(ModelAdmin):
    list_display = ('project_title', 'client_name', 'current_phase', 'progress_percentage', 'last_updated')
    list_filter = ('progress_percentage',)
    search_fields = ('project_title', 'client_name')
    inlines = [ProjectMilestoneInline]


# Referral & Wallet admin
@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = ('id', 'referred_email', 'referrer', 'status', 'created_at', 'confirmed_at')
    list_filter = ('status', 'created_at')
    search_fields = ('referred_email', 'referrer__username')
    actions = ['mark_confirmed']

    def mark_confirmed(self, request, queryset):
        for r in queryset:
            r.confirm()
        self.message_user(request, "Selected referrals marked confirmed and referrers credited.")

    mark_confirmed.short_description = "Mark selected referrals as confirmed"


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance', 'currency')
    search_fields = ('user__username',)


@admin.register(SupportRequest)
class SupportRequestAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'category', 'subject', 'status', 'created_at')
    list_filter = ('category', 'status', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')


@admin.register(SiteBrand)
class SiteBrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'updated_at')
    readonly_fields = ('updated_at',)
