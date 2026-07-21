from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core_api.views import (
    BranchLocationViewSet, VehicleViewSet,
    PropertyViewSet, InspectionBookingViewSet, BuildProjectViewSet
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

urlpatterns = [
    path("", RedirectView.as_view(url="/admin/", permanent=False)),
    path("admin/", admin.site.urls),
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/", include(router.urls)),
]
