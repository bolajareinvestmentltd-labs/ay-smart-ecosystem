import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-aysmart-ecosystem-secret-key-change-in-production')
DEBUG = os.getenv('DEBUG', 'True').lower() in ('1', 'true', 'yes')
ALLOWED_HOSTS = [host.strip() for host in os.getenv('ALLOWED_HOSTS', '*').split(',') if host.strip()]

# Application definition
INSTALLED_APPS = [
    # django-unfold must be placed BEFORE django.contrib.admin
    "unfold",
    "unfold.contrib.filters",
    "unfold.contrib.forms",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    
    # Third-party & Local Apps
    "corsheaders",
    "rest_framework",
    "core_api",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware", # CORS Middleware added
    "core_backend.jwt_cookie_middleware.JWTAuthCookieMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core_backend.wsgi.application"

# Database Configuration (Default SQLite for local testing, ready for Supabase/Neon URL)
# Be tolerant of an empty/invalid DATABASE_URL (e.g. '://') and fall back to SQLite.
raw_db = os.getenv('DATABASE_URL', '').strip()
if not raw_db:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": str(BASE_DIR / "db.sqlite3"),
        }
    }
else:
    try:
        DATABASES = {"default": dj_database_url.parse(raw_db)}
    except Exception:
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": str(BASE_DIR / "db.sqlite3"),
            }
        }

# Unified Authentication Configuration (SSO via JWT)
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ),
    # Throttle rates for specific endpoints (used by custom throttles)
    'DEFAULT_THROTTLE_RATES': {
        'resend_verification': '5/hour',
    },
}

# Allow Next.js Vercel/Localhost frontend domains to communicate without CORS errors
CORS_ALLOWED_ORIGINS = [
    origin.strip() for origin in os.getenv(
        'CORS_ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:3001'
    ).split(',') if origin.strip()
]
CORS_ALLOW_CREDENTIALS = True
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SECURE = not DEBUG

FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
EMAIL_BACKEND = os.getenv(
    'EMAIL_BACKEND',
    'django.core.mail.backends.console.EmailBackend' if DEBUG else 'django.core.mail.backends.smtp.EmailBackend',
)
EMAIL_HOST = os.getenv('EMAIL_HOST', os.getenv('RESEND_SMTP_HOST', 'smtp.resend.com'))
EMAIL_PORT = int(os.getenv('EMAIL_PORT', os.getenv('RESEND_SMTP_PORT', '587')))
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', os.getenv('RESEND_SMTP_USERNAME', 'resend'))
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', os.getenv('RESEND_API_KEY', ''))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', os.getenv('RESEND_EMAIL_USE_TLS', 'True')).lower() in ('1', 'true', 'yes')
EMAIL_USE_SSL = os.getenv('EMAIL_USE_SSL', 'False').lower() in ('1', 'true', 'yes')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', os.getenv('RESEND_FROM_EMAIL', 'noreply@resend.dev'))
RESEND_API_KEY = os.getenv('RESEND_API_KEY', '')
RESEND_WEBHOOK_SIGNING_SECRET = os.getenv('RESEND_WEBHOOK_SIGNING_SECRET', '')

SUPABASE_URL = os.getenv('SUPABASE_URL', '')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY', '')
SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY', '')

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# AY'SMART White-Label Brand Customization for django-unfold CMS
UNFOLD = {
    "SITE_TITLE": "AY'SMART Central Portal",
    "SITE_HEADER": "Real Estate & Automotive Management",
    "COLORS": {
        "primary": {
            "500": "#0f172a",  # Deep Navy / Obsidian for Property modules
            "600": "#334155",  # Carbon Black for Automotive modules
        },
    },
}

# ==========================================
# AY'SMART LUXURY ADMIN BRANDING (UNFOLD)
# ==========================================
from django.templatetags.static import static

UNFOLD = {
    "SITE_TITLE": "AY'SMART Central Portal",
    "SITE_HEADER": "AY'SMART INVESTMENT LTD",
    "SITE_URL": "/",
    "THEME": "dark",  # Forces consistent luxury dark-mode rendering
    "COLORS": {
        "primary": {
            "50": "#fffbeb",
            "100": "#fef3c7",
            "200": "#fde68a",
            "300": "#fcd34d",
            "400": "#fbbf24",
            "500": "#f59e0b",  # AY'SMART Signature Gold/Amber
            "600": "#d97706",
            "700": "#b45309",
            "800": "#92400e",
            "900": "#78350f",
            "950": "#451a03",
        },
    },
}

# Added for Render Deployment & Whitenoise Static Files
import os
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Cookie names for JWT when using HttpOnly cookie auth
ACCESS_COOKIE_NAME = os.getenv('ACCESS_COOKIE_NAME', 'access')
REFRESH_COOKIE_NAME = os.getenv('REFRESH_COOKIE_NAME', 'refresh')

# --- Render Static Files & Security Configuration ---
import os
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
