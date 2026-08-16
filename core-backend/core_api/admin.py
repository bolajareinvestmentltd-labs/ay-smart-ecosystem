from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin
from .models import (
    BranchLocation, Vehicle, PickupVoucher,
    Property, InspectionBooking, InspectionBookingMessage,
    PropertyImage, Promotion,
    BuildProject, ProjectMilestone, UserProfile, Listing, ListingImage,
    SavedSearch, FavoriteListing, HiddenListing, Conversation, ConversationMessage,
    PaymentTransaction,
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
    fields = ('image_preview', 'image', 'url', 'caption', 'order')
    readonly_fields = ('image_preview',)
    
    def image_preview(self, obj):
        """Display thumbnail preview of the image"""
        if obj.image:
            return format_html(
                '<img src="{}" width="100" height="100" style="border-radius: 4px; object-fit: cover;" />',
                obj.image.url
            )
        elif obj.url:
            return format_html(
                '<img src="{}" width="100" height="100" style="border-radius: 4px; object-fit: cover;" />',
                obj.url
            )
        return "No image"
    image_preview.short_description = "Preview"

@admin.register(Property)
class PropertyAdmin(ModelAdmin):
    list_display = ('title', 'property_type', 'price', 'is_for_lease', 'is_available', 'image_count')
    list_filter = ('property_type', 'is_for_lease', 'is_available')
    search_fields = ('title', 'location_address')
    inlines = [PropertyImageInline]
    
    def image_count(self, obj):
        """Show count of images for this property"""
        count = obj.images.count()
        return format_html(
            '<span style="background-color: #ddd; padding: 2px 8px; border-radius: 12px;">{} images</span>',
            count
        )
    image_count.short_description = "Images"

@admin.register(PropertyImage)
class PropertyImageAdmin(ModelAdmin):
    list_display = ('property', 'image_thumbnail', 'caption', 'order')
    list_filter = ('property', 'order')
    search_fields = ('property__title', 'caption')
    readonly_fields = ('image_preview',)
    fields = ('property', 'image', 'url', 'caption', 'order', 'image_preview')
    ordering = ('property', 'order')
    
    def image_thumbnail(self, obj):
        """Display thumbnail in list view"""
        if obj.image:
            return format_html(
                '<img src="{}" width="80" height="80" style="border-radius: 4px; object-fit: cover;" />',
                obj.image.url
            )
        elif obj.url:
            return format_html(
                '<img src="{}" width="80" height="80" style="border-radius: 4px; object-fit: cover;" />',
                obj.url
            )
        return "No image"
    image_thumbnail.short_description = "Thumbnail"
    
    def image_preview(self, obj):
        """Display large preview in detail view"""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 400px; max-height: 400px; border-radius: 8px;" />',
                obj.image.url
            )
        elif obj.url:
            return format_html(
                '<img src="{}" style="max-width: 400px; max-height: 400px; border-radius: 8px;" />',
                obj.url
            )
        return "No image"
    image_preview.short_description = "Full Preview"

@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ('title', 'discount_text', 'audience', 'is_active', 'display_order', 'updated_at')
    list_filter = ('audience', 'is_active')
    search_fields = ('title', 'subtitle', 'discount_text')
    ordering = ('display_order', '-updated_at')


class ListingImageInline(admin.TabularInline):
    model = ListingImage
    extra = 1
    fields = ('image_preview', 'image', 'caption', 'order')
    readonly_fields = ('image_preview',)
    
    def image_preview(self, obj):
        """Display thumbnail preview of the image"""
        if obj.image:
            return format_html(
                '<img src="{}" width="100" height="100" style="border-radius: 4px; object-fit: cover;" />',
                obj.image.url
            )
        return "No image"
    image_preview.short_description = "Preview"

@admin.register(Listing)
class ListingAdmin(ModelAdmin):
    list_display = ('title', 'user', 'category', 'location', 'price', 'plan', 'status', 'image_count', 'created_at')
    list_filter = ('status', 'category', 'plan', 'created_at')
    search_fields = ('title', 'location', 'user__username', 'user__email')
    ordering = ('-created_at',)
    inlines = [ListingImageInline]
    actions = ['approve_selected_listings', 'reject_selected_listings']

    def image_count(self, obj):
        """Show count of images for this listing"""
        count = obj.images.count()
        return format_html(
            '<span style="background-color: #ddd; padding: 2px 8px; border-radius: 12px;">{} images</span>',
            count
        )
    image_count.short_description = "Images"

    @admin.action(description='Approve selected listings')
    def approve_selected_listings(self, request, queryset):
        updated = queryset.update(status='LIVE')
        self.message_user(request, f'{updated} listing(s) approved and published.')

    @admin.action(description='Reject selected listings')
    def reject_selected_listings(self, request, queryset):
        updated = queryset.update(status='REJECTED')
        self.message_user(request, f'{updated} listing(s) rejected.')

@admin.register(ListingImage)
class ListingImageAdmin(ModelAdmin):
    list_display = ('listing', 'image_thumbnail', 'caption', 'order')
    list_filter = ('listing', 'order')
    search_fields = ('listing__title', 'caption')
    readonly_fields = ('image_preview',)
    fields = ('listing', 'image', 'caption', 'order', 'image_preview')
    ordering = ('listing', 'order')
    
    def image_thumbnail(self, obj):
        """Display thumbnail in list view"""
        if obj.image:
            return format_html(
                '<img src="{}" width="80" height="80" style="border-radius: 4px; object-fit: cover;" />',
                obj.image.url
            )
        return "No image"
    image_thumbnail.short_description = "Thumbnail"
    
    def image_preview(self, obj):
        """Display large preview in detail view"""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 400px; max-height: 400px; border-radius: 8px;" />',
                obj.image.url
            )
        return "No image"
    image_preview.short_description = "Full Preview"


class InspectionBookingMessageInline(admin.TabularInline):
    model = InspectionBookingMessage
    extra = 0
    fields = ('sender_name', 'sender_role', 'text', 'created_at')
    readonly_fields = ('created_at',)

@admin.register(InspectionBooking)
class InspectionBookingAdmin(ModelAdmin):
    list_display = (
        'client_name', 'client_phone', 'property_to_view', 'assigned_agent', 'agent_response', 'status', 'payment_unlocked', 'admin_approved', 'contact_released'
    )
    list_filter = ('status', 'payment_unlocked', 'agent_response', 'admin_approved')
    search_fields = ('client_name', 'client_phone', 'property_to_view__title', 'assigned_agent__username')
    inlines = [InspectionBookingMessageInline]


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


@admin.register(UserProfile)
class UserProfileAdmin(ModelAdmin):
    list_display = ('user', 'role', 'phone', 'location', 'email_verified', 'is_kyc_verified', 'is_admin_approved', 'student_matric_number')
    list_filter = ('role', 'email_verified', 'is_kyc_verified', 'is_admin_approved')
    search_fields = ('user__username', 'user__email', 'phone', 'student_matric_number', 'location')
    ordering = ('-updated_at',)
    actions = ['approve_selected_users', 'mark_kyc_verified', 'reset_kyc_status']

    @admin.action(description='Approve selected users')
    def approve_selected_users(self, request, queryset):
        updated = queryset.update(is_admin_approved=True, is_kyc_verified=True)
        self.message_user(request, f'{updated} user(s) approved and marked KYC verified.')

    @admin.action(description='Mark selected users as KYC verified')
    def mark_kyc_verified(self, request, queryset):
        updated = queryset.update(is_kyc_verified=True)
        self.message_user(request, f'{updated} user(s) marked as KYC verified.')

    @admin.action(description='Reset selected users KYC status')
    def reset_kyc_status(self, request, queryset):
        updated = queryset.update(is_kyc_verified=False, is_admin_approved=False)
        self.message_user(request, f'{updated} user(s) reset to pending verification.')


@admin.register(SavedSearch)
class SavedSearchAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'location', 'property_type', 'min_price', 'max_price', 'updated_at')
    search_fields = ('name', 'location', 'user__username')


@admin.register(FavoriteListing)
class FavoriteListingAdmin(admin.ModelAdmin):
    list_display = ('user', 'listing', 'created_at')
    search_fields = ('user__username', 'listing__title')


@admin.register(HiddenListing)
class HiddenListingAdmin(admin.ModelAdmin):
    list_display = ('user', 'listing', 'created_at')
    search_fields = ('user__username', 'listing__title')


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('user', 'subject', 'listing', 'status', 'updated_at')
    list_filter = ('status',)
    search_fields = ('subject', 'user__username', 'listing__title')


@admin.register(ConversationMessage)
class ConversationMessageAdmin(admin.ModelAdmin):
    list_display = ('conversation', 'sender_name', 'created_at')
    search_fields = ('sender_name', 'text')


@admin.register(SupportRequest)
class SupportRequestAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'category', 'subject', 'status', 'created_at')
    list_filter = ('category', 'status', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')


@admin.register(SiteBrand)
class SiteBrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'updated_at')
    readonly_fields = ('updated_at',)


@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'amount', 'provider', 'status', 'provider_reference', 'created_at')
    list_filter = ('provider', 'status', 'plan', 'created_at')
    search_fields = ('user__username', 'user__email', 'provider_reference')
    readonly_fields = ('provider_reference', 'created_at', 'updated_at')
    ordering = ('-created_at',)
    actions = ['mark_success', 'mark_failed']

    @admin.action(description='Mark selected transactions as successful')
    def mark_success(self, request, queryset):
        updated = queryset.update(status='SUCCESS')
        self.message_user(request, f'{updated} transaction(s) marked as successful.')

    @admin.action(description='Mark selected transactions as failed')
    def mark_failed(self, request, queryset):
        updated = queryset.update(status='FAILED')
        self.message_user(request, f'{updated} transaction(s) marked as failed.')

