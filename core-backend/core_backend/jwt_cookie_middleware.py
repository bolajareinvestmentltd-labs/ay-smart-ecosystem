from django.conf import settings


class JWTAuthCookieMiddleware:
    """If no Authorization header is present, but an access cookie exists,
    copy it into HTTP_AUTHORIZATION so SimpleJWT can authenticate.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if 'HTTP_AUTHORIZATION' not in request.META:
            access = request.COOKIES.get(getattr(settings, 'ACCESS_COOKIE_NAME', 'access'))
            if access:
                request.META['HTTP_AUTHORIZATION'] = f'Bearer {access}'
        return self.get_response(request)
