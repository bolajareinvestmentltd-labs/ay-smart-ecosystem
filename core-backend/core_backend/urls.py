from django.conf import settings
from django.conf.urls.static import static
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
    path("api/auth/verify-email/", __import__('core_api.views', fromlist=['']).EmailVerificationView.as_view(), name="auth_verify_email"),
    path("api/auth/password-reset/", __import__('core_api.views', fromlist=['']).PasswordResetView.as_view(), name="auth_password_reset"),
    path("api/auth/resend-verification/", __import__('core_api.views', fromlist=['']).ResendVerificationView.as_view(), name="auth_resend_verification"),
    path("api/auth/email-webhook/", __import__('core_api.views', fromlist=['']).EmailWebhookView.as_view(), name="auth_email_webhook"),
    path("api/auth/me/", UserInfoView.as_view(), name="auth_me"),
    path("api/auth/profile/", ProfileView.as_view(), name="auth_profile"),
    path("api/kyc/approve/", KycApprovalView.as_view(), name="kyc_approve"),
    path("api/payments/checkout/", CheckoutView.as_view(), name="checkout"),
    path("api/payments/initiate/", PaymentInitiateView.as_view(), name="payment_initiate"),
    path("api/payments/verify/", PaymentVerifyView.as_view(), name="payment_verify"),
    path("api/", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
