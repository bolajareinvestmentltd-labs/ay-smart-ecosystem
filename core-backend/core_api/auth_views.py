from django.conf import settings
from django.db.models import Q
from django.contrib.auth.models import User
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework import status


class CookieTokenObtainPairView(TokenObtainPairView):
    """Return tokens and set them as HttpOnly cookies."""

    def post(self, request, *args, **kwargs):
        identifier = (request.data.get('username') or '').strip()
        if identifier:
            user = User.objects.filter(Q(username__iexact=identifier) | Q(email__iexact=identifier)).first()
            if user and not getattr(user.profile, 'email_verified', False):
                return Response({'detail': 'Please verify your email before signing in.'}, status=status.HTTP_401_UNAUTHORIZED)
            if user and identifier.lower() != user.username.lower():
                request.data['username'] = user.username

        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            data = response.data
            access = data.get('access')
            refresh = data.get('refresh')
            secure = not settings.DEBUG
            same_site = 'None' if secure else 'Lax'
            # Set cookies
            if access:
                response.set_cookie(
                    settings.ACCESS_COOKIE_NAME,
                    access,
                    httponly=True,
                    secure=secure,
                    samesite=same_site,
                    path='/',
                )
            if refresh:
                response.set_cookie(
                    settings.REFRESH_COOKIE_NAME,
                    refresh,
                    httponly=True,
                    secure=secure,
                    samesite=same_site,
                    path='/',
                )
        return response


class CookieTokenRefreshView(TokenRefreshView):
    """Read refresh token from cookie and return new access token (also set cookie)."""

    def post(self, request, *args, **kwargs):
        refresh = request.COOKIES.get(settings.REFRESH_COOKIE_NAME) or request.data.get('refresh')
        if not refresh:
            return Response({'detail': 'Session expired. Please sign in again.'}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = self.get_serializer(data={'refresh': refresh})
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError:
            return Response({'detail': 'Session expired. Please sign in again.'}, status=status.HTTP_401_UNAUTHORIZED)

        response = Response(serializer.validated_data, status=status.HTTP_200_OK)
        access = response.data.get('access')
        if access:
            secure = not settings.DEBUG
            same_site = 'None' if secure else 'Lax'
            response.set_cookie(
                settings.ACCESS_COOKIE_NAME,
                access,
                httponly=True,
                secure=secure,
                samesite=same_site,
                path='/',
            )
        return response


from rest_framework.views import APIView


class LogoutView(APIView):
    def post(self, request):
        response = Response({'detail': 'Logged out'}, status=status.HTTP_200_OK)
        response.delete_cookie(settings.ACCESS_COOKIE_NAME, path='/')
        response.delete_cookie(settings.REFRESH_COOKIE_NAME, path='/')
        return response


class GoogleSocialAuthView(APIView):
    """
    Accepts Google OAuth id_token or credential from frontend, verifies with Google,
    provisions or loads User + UserProfile, and sets standard HttpOnly JWT cookies.
    """
    permission_classes = []

    def post(self, request):
        import requests
        from rest_framework_simplejwt.tokens import RefreshToken
        from .models_legacy import UserProfile, Wallet

        token = (
            request.data.get('id_token')
            or request.data.get('credential')
            or request.data.get('token')
            or ''
        ).strip()

        if not token:
            return Response({'detail': 'Token/credential is required.'}, status=status.HTTP_400_BAD_REQUEST)

        email = None
        first_name = ''
        last_name = ''

        # 1. Attempt to verify with Google tokeninfo endpoint
        try:
            res = requests.get(f'https://oauth2.googleapis.com/tokeninfo?id_token={token}', timeout=5)
            if res.status_code == 200:
                data = res.json()
                email = (data.get('email') or '').strip().lower()
                first_name = data.get('given_name') or ''
                last_name = data.get('family_name') or ''
        except Exception:
            pass

        # 2. Fallback for testing/development environments
        if not email and settings.DEBUG:
            email = (request.data.get('email') or '').strip().lower()
            first_name = request.data.get('first_name') or 'Google'
            last_name = request.data.get('last_name') or 'User'

        if not email:
            return Response({'detail': 'Invalid or expired Google token.'}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Find or create Django User
        user = User.objects.filter(email__iexact=email).first()
        if not user:
            base_username = email.split('@')[0].replace('.', '_').replace('-', '_')
            username = base_username
            idx = 1
            while User.objects.filter(username__iexact=username).exists():
                username = f"{base_username}_{idx}"
                idx += 1

            user = User.objects.create_user(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
            )
            user.set_unusable_password()
            user.save()

        # 4. Ensure UserProfile and Wallet exist
        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.email_verified = True
        profile.save(update_fields=['email_verified'])
        Wallet.objects.get_or_create(user=user)

        # 5. Issue SimpleJWT tokens
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        secure = not settings.DEBUG
        same_site = 'None' if secure else 'Lax'

        response = Response({
            'success': True,
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'name': ' '.join(filter(None, [user.first_name, user.last_name])).strip(),
            'role': profile.role,
            'access': access,
            'refresh': str(refresh),
        }, status=status.HTTP_200_OK)

        response.set_cookie(
            settings.ACCESS_COOKIE_NAME,
            access,
            httponly=True,
            secure=secure,
            samesite=same_site,
            path='/',
        )
        response.set_cookie(
            settings.REFRESH_COOKIE_NAME,
            str(refresh),
            httponly=True,
            secure=secure,
            samesite=same_site,
            path='/',
        )
        return response

