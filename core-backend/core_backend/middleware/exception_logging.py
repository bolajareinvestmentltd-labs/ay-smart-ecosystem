import os
import traceback
import datetime

from django.conf import settings


class ExceptionLoggingMiddleware:
    """Middleware that logs unhandled exceptions to a file under BASE_DIR/logs.

    This is temporary debug middleware to capture tracebacks on deployed hosts
    where direct access to stdout/host logs may be inconvenient.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        try:
            base = str(settings.BASE_DIR)
        except Exception:
            base = os.getcwd()

        self.log_dir = os.path.join(base, 'logs')
        try:
            os.makedirs(self.log_dir, exist_ok=True)
        except Exception:
            pass
        self.log_path = os.path.join(self.log_dir, 'last_traceback.log')

    def __call__(self, request):
        try:
            return self.get_response(request)
        except Exception:
            try:
                tb = traceback.format_exc()
                with open(self.log_path, 'a', encoding='utf-8') as fh:
                    fh.write('--- %s UTC ---\n' % datetime.datetime.utcnow().isoformat())
                    fh.write('Request: %s %s\n' % (request.method, request.get_full_path()))
                    try:
                        user = getattr(request, 'user', None)
                        if user and getattr(user, 'is_authenticated', False):
                            fh.write('User: %s (id=%s)\n' % (getattr(user, 'username', '<unknown>'), getattr(user, 'id', '')))
                    except Exception:
                        pass
                    fh.write(tb + '\n\n')
            except Exception:
                # If logging fails, don't mask original exception
                pass
            raise
