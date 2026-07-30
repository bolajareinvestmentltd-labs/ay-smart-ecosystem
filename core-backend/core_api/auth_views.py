from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings


class CookieTokenObtainPairView(TokenObtainPairView):
    """Return tokens and set them as HttpOnly cookies."""

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            data = response.data
            access = data.get('access')
            refresh = data.get('refresh')
            secure = not settings.DEBUG
            # Set cookies
            if access:
                response.set_cookie(
                    settings.ACCESS_COOKIE_NAME,
                    access,
                    httponly=True,
                    secure=secure,
                    samesite='Lax',
                    path='/',
                )
            if refresh:
                response.set_cookie(
                    settings.REFRESH_COOKIE_NAME,
                    refresh,
                    httponly=True,
                    secure=secure,
                    samesite='Lax',
                    path='/',
                )
        return response


class CookieTokenRefreshView(TokenRefreshView):
    """Read refresh token from cookie and return new access token (also set cookie)."""

    def post(self, request, *args, **kwargs):
        # Prefer cookie
        refresh = request.COOKIES.get(settings.REFRESH_COOKIE_NAME) or request.data.get('refresh')
        if not refresh:
            return Response({'detail': 'Refresh token not provided.'}, status=status.HTTP_400_BAD_REQUEST)

        request.data['refresh'] = refresh
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access = response.data.get('access')
            if access:
                secure = not settings.DEBUG
                response.set_cookie(
                    settings.ACCESS_COOKIE_NAME,
                    access,
                    httponly=True,
                    secure=secure,
                    samesite='Lax',
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
