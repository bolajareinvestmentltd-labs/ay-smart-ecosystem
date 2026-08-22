from django.conf import settings


class JWTAuthCookieMiddleware:
    """If no Authorization header is present, but an access cookie exists,
    copy it into HTTP_AUTHORIZATION so SimpleJWT can authenticate.
    Cookie-authenticated unsafe requests remain protected by Django CSRF.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        access = request.COOKIES.get(getattr(settings, 'ACCESS_COOKIE_NAME', 'access'))
        if 'HTTP_AUTHORIZATION' not in request.META and access:
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {access}'
        if request.method not in ('GET', 'HEAD', 'OPTIONS', 'TRACE') and not access:
            request._dont_enforce_csrf_checks = True
        return self.get_response(request)
