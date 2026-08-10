import json
import os
import sys
import uuid
from pathlib import Path
import urllib.request
import urllib.error
import http.cookiejar

BASE_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core_backend.settings')

import django

django.setup()

from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

BASE_URL = 'http://127.0.0.1:8000'

jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))

def print_result(name, code, body):
    print(f"{name}: {code}")
    print(body)
    print('-' * 80)


def post(path, data):
    req = urllib.request.Request(BASE_URL + path, data=json.dumps(data).encode('utf-8'), method='POST')
    req.add_header('Content-Type', 'application/json')
    try:
        with opener.open(req, timeout=30) as resp:
            return resp.getcode(), resp.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')
    except Exception as exc:
        return 0, f'EXCEPTION: {exc}'


def get(path):
    req = urllib.request.Request(BASE_URL + path, method='GET')
    try:
        with opener.open(req, timeout=30) as resp:
            return resp.getcode(), resp.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')
    except Exception as exc:
        return 0, f'EXCEPTION: {exc}'


def main():
    rnd = str(uuid.uuid4())[:8]
    username = f'testuser_{rnd}'
    email = f'{username}@example.com'
    password = 'TestPass123!'

    print('=== REGISTER ===')
    code, body = post('/api/auth/register/', {
        'username': username,
        'email': email,
        'password': password,
        'first_name': 'Test',
        'last_name': 'User'
    })
    print_result('register', code, body)

    print('=== VERIFY EMAIL ===')
    if code == 201:
        try:
            user = User.objects.get(username=username)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            verify_code, verify_body = post('/api/auth/verify-email/', {'uid': uid, 'token': token})
        except Exception as exc:
            verify_code, verify_body = 0, f'EXCEPTION: {exc}'
    else:
        verify_code, verify_body = 0, 'Skipped because registration failed.'
    print_result('verify_email', verify_code, verify_body)

    print('=== LOGIN ===')
    code, body = post('/api/auth/login-cookie/', {'username': username, 'password': password})
    print_result('login', code, body)
    print('cookies after login:', [f'{c.name}={c.value}' for c in jar])
    print('-' * 80)

    print('=== PROFILE ===')
    code, body = get('/api/auth/profile/')
    print_result('profile', code, body)

    print('=== REFRESH COOKIE ===')
    code, body = post('/api/auth/refresh-cookie/', {})
    print_result('refresh', code, body)
    print('cookies after refresh:', [f'{c.name}={c.value}' for c in jar])
    print('-' * 80)

    print('=== LOGOUT ===')
    code, body = post('/api/auth/logout/', {})
    print_result('logout', code, body)
    print('cookies after logout:', [f'{c.name}={c.value}' for c in jar])


if __name__ == '__main__':
    main()
