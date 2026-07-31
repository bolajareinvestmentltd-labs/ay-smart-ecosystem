from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework.routers import DefaultRouter
from core_api.auth_views import CookieTokenObtainPairView, CookieTokenRefreshView, LogoutView
from core_api.views import (
    BranchLocationViewSet, BuildProjectViewSet, CheckoutView,
    InspectionBookingViewSet, KycApprovalView, ListingViewSet, PaymentInitiateView,
    PaymentVerifyView, ProfileView, PropertyViewSet, RegisterView, ReferralViewSet,
    SupportRequestViewSet, UserInfoView, VehicleViewSet, WalletViewSet,
)

# Explicit High-Contrast Branding Overrides
admin.site.site_header = "AY'SMART INVESTMENT LTD"
admin.site.site_title = "AY'SMART Central Portal"
admin.site.index_title = "Ecosystem Executive Administration"

# Automated REST API Router
router = DefaultRouter()
router.register(r'branches', BranchLocationViewSet, basename='branch')
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'inspections', InspectionBookingViewSet, basename='inspection')
router.register(r'build-tracker', BuildProjectViewSet, basename='build-tracker')
router.register(r'listings', ListingViewSet, basename='listing')
router.register(r'referrals', ReferralViewSet, basename='referral')
router.register(r'wallets', WalletViewSet, basename='wallet')
router.register(r'support/requests', SupportRequestViewSet, basename='support-request')

urlpatterns = [
    path("", RedirectView.as_view(url="/admin/", permanent=False)),
    path("admin/", admin.site.urls),
    # Cookie-based auth endpoints (sets HttpOnly cookies)
    path("api/auth/login-cookie/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair_cookie"),
    path("api/auth/refresh-cookie/", CookieTokenRefreshView.as_view(), name="token_refresh_cookie"),
    path("api/auth/logout/", LogoutView.as_view(), name="token_logout"),
    path("api/auth/register/", RegisterView.as_view(), name="auth_register"),
    path("api/auth/me/", UserInfoView.as_view(), name="auth_me"),
    path("api/auth/profile/", ProfileView.as_view(), name="auth_profile"),
    path("api/kyc/approve/", KycApprovalView.as_view(), name="kyc_approve"),
    path("api/payments/checkout/", CheckoutView.as_view(), name="checkout"),
    path("api/payments/initiate/", PaymentInitiateView.as_view(), name="payment_initiate"),
    path("api/payments/verify/", PaymentVerifyView.as_view(), name="payment_verify"),
    path("api/", include(router.urls)),
]
