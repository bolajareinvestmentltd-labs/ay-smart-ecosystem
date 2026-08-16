import os
import socket
from pathlib import Path
from urllib.parse import urlparse
from dotenv import load_dotenv
import dj_database_url

# Compatibility shim: ensure django.utils.cache exposes names some third-party
# packages (e.g., older/newer DRF) expect (cc_delim_re, patch_vary_headers).
try:
    import re
    import importlib

    _cache = importlib.import_module('django.utils.cache')
    if not hasattr(_cache, 'cc_delim_re'):
        _cache.cc_delim_re = re.compile(r'\s*,\s*')

    if not hasattr(_cache, 'patch_vary_headers'):
        def _patch_vary_headers(response, newheaders):
            existing = response.get('Vary')
            if existing:
                existing_headers = [h.strip() for h in existing.split(',') if h.strip()]
                for h in newheaders:
                    if h not in existing_headers:
                        existing_headers.append(h)
                response['Vary'] = ', '.join(existing_headers)
            else:
                response['Vary'] = ', '.join(newheaders)

        _cache.patch_vary_headers = _patch_vary_headers
except Exception:
    pass

BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_ENV_FILE = BASE_DIR.parent / '.env'
load_dotenv(ROOT_ENV_FILE)

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-aysmart-ecosystem-secret-key-change-in-production')
DEBUG = os.getenv('DEBUG', 'True').lower() in ('1', 'true', 'yes')
ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv(
        'ALLOWED_HOSTS',
        'localhost,127.0.0.1,testserver,ay-smart-backend.onrender.com,api.aysmartinvestmentltd.com'
    ).split(',')
    if host.strip()
]

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
    "cloudinary_storage",
    "core_api",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "core_backend.middleware.exception_logging.ExceptionLoggingMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
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

def resolve_ipv4_address(host: str, port: int = 5432) -> str | None:
    """Resolve the given host to an IPv4 address, if available."""
    try:
        addresses = socket.getaddrinfo(host, port, family=socket.AF_INET, type=socket.SOCK_STREAM, proto=socket.IPPROTO_TCP)
        if not addresses:
            return None
        return addresses[0][4][0]
    except OSError:
        return None


def build_database_config(raw_database_url: str) -> dict:
    db_config = dj_database_url.parse(raw_database_url)
    host = db_config.get('HOST')
    port = int(db_config.get('PORT') or 5432)
    if host and not host.replace('.', '').isdigit():
        ipv4 = resolve_ipv4_address(host, port)
        if ipv4:
            db_options = db_config.get('OPTIONS', {}) or {}
            db_options.setdefault('hostaddr', ipv4)
            db_config['OPTIONS'] = db_options
    return db_config

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
        DATABASES = {"default": build_database_config(raw_db)}
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
        'CORS_ALLOWED_ORIGINS',
        'http://localhost:3000,http://localhost:3001,https://aysmartinvestmentltd.com,https://www.aysmartinvestmentltd.com'
    ).split(',') if origin.strip()
]
CORS_ALLOW_CREDENTIALS = True
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SECURE = not DEBUG
SESSION_COOKIE_SECURE = not DEBUG
SECURE_SSL_REDIRECT = not DEBUG
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
USE_X_FORWARDED_HOST = True
SECURE_HSTS_SECONDS = 31536000 if not DEBUG else 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = not DEBUG
SECURE_HSTS_PRELOAD = not DEBUG

FRONTEND_URL = os.getenv('FRONTEND_URL', 'https://aysmartinvestmentltd.com')
CSRF_TRUSTED_ORIGINS = [
    origin.strip() for origin in os.getenv(
        'CSRF_TRUSTED_ORIGINS',
        f'{FRONTEND_URL},https://aysmartinvestmentltd.com,https://www.aysmartinvestmentltd.com'
    ).split(',') if origin.strip()
]
email_backend_env = os.getenv('EMAIL_BACKEND', '').strip()
if email_backend_env:
    EMAIL_BACKEND = email_backend_env
elif os.getenv('RESEND_API_KEY') or os.getenv('EMAIL_HOST'):
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
else:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend' if DEBUG else 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_HOST = os.getenv('EMAIL_HOST', os.getenv('RESEND_SMTP_HOST', 'smtp.resend.com'))
EMAIL_PORT = int(os.getenv('EMAIL_PORT', os.getenv('RESEND_SMTP_PORT', '587')))
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', os.getenv('RESEND_SMTP_USERNAME', 'resend'))
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', os.getenv('RESEND_API_KEY', ''))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', os.getenv('RESEND_EMAIL_USE_TLS', 'True')).lower() in ('1', 'true', 'yes')
EMAIL_USE_SSL = os.getenv('EMAIL_USE_SSL', 'False').lower() in ('1', 'true', 'yes')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', os.getenv('RESEND_FROM_EMAIL', 'support@aysmartinvestmentltd.com'))
RESEND_API_KEY = os.getenv('RESEND_API_KEY', '')
RESEND_WEBHOOK_SIGNING_SECRET = os.getenv('RESEND_WEBHOOK_SIGNING_SECRET', '')

PAYSTACK_PUBLIC_KEY = os.getenv('PAYSTACK_PUBLIC_KEY', '').strip()
PAYSTACK_SECRET_KEY = os.getenv('PAYSTACK_SECRET_KEY', '').strip()
PAYSTACK_USE_TEST_MODE = os.getenv('PAYSTACK_USE_TEST_MODE', 'true').lower() in {'1', 'true', 'yes', 'on'}

# WEMA Bank API Configuration
WEMA_API_KEY = os.getenv('WEMA_API_KEY', '').strip()
WEMA_BANK_CODE = os.getenv('WEMA_BANK_CODE', '035')  # Standard WEMA bank code
WEMA_API_URL = os.getenv('WEMA_API_URL', 'https://sandbox.wemabank.com/api')  # Change to production URL when ready

SUPABASE_URL = os.getenv('SUPABASE_URL', '')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY', '')
SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY', '')

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
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
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
WHITENOISE_AUTOREFRESH = DEBUG
WHITENOISE_KEEP_ONLY_HASHED_FILES = True

# Cloudinary Configuration for Image Storage
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv('CLOUDINARY_CLOUD_NAME', ''),
    'API_KEY': os.getenv('CLOUDINARY_API_KEY', ''),
    'API_SECRET': os.getenv('CLOUDINARY_API_SECRET', ''),
}

# Use Cloudinary storage if configured, else fall back to local MEDIA_ROOT
if os.getenv('CLOUDINARY_CLOUD_NAME'):
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
    MEDIA_URL = '/media/'  # Still accessible via /media/ URL pattern
else:
    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Cookie names for JWT when using HttpOnly cookie auth
ACCESS_COOKIE_NAME = os.getenv('ACCESS_COOKIE_NAME', 'access')
REFRESH_COOKIE_NAME = os.getenv('REFRESH_COOKIE_NAME', 'refresh')
