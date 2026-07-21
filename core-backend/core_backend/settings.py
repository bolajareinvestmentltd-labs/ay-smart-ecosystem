import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'django-insecure-aysmart-ecosystem-secret-key-change-in-production'
DEBUG = True
ALLOWED_HOSTS = ['*']

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
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
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
}

# Allow Next.js Vercel/Localhost frontend domains to communicate without CORS errors
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
]

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
