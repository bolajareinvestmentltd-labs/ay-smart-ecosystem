import os
import sys
import json
import requests
from pprint import pprint

API_BASE = os.getenv('API_BASE', 'https://api.aysmartinvestmentltd.com')
ADMIN_USER = os.getenv('ADMIN_USERNAME', 'admin')
ADMIN_PASS = os.getenv('ADMIN_PASSWORD', 'AySmartAdmin!2026')
# Optional controls
TIMEOUT = int(os.getenv('CHECK_TIMEOUT', '30'))
VERIFY_TLS = os.getenv('CHECK_VERIFY_TLS', 'true').lower() in ('1', 'true', 'yes')

print('API base:', API_BASE)

session = requests.Session()
login_url = f"{API_BASE}/api/auth/login-cookie/"
print('\n== LOGIN ==')
try:
    r = session.post(login_url, json={'username': ADMIN_USER, 'password': ADMIN_PASS}, timeout=TIMEOUT, verify=VERIFY_TLS)
    print('login status:', r.status_code)
    try:
        pprint(r.json())
    except Exception:
        print(r.text)
except Exception as e:
    print('Login request failed:', e)
    sys.exit(2)

print('\nCookies after login:')
for c in session.cookies:
    print(f"{c.name}={c.value}")

print('\n== /api/auth/me ==')
try:
    r = session.get(f"{API_BASE}/api/auth/me/", timeout=TIMEOUT, verify=VERIFY_TLS)
    print('status:', r.status_code)
    try:
        pprint(r.json())
    except Exception:
        print(r.text)
except Exception as e:
    print('me request failed:', e)

print('\n== /api/properties/ ==')
try:
    r = session.get(f"{API_BASE}/api/properties/", timeout=TIMEOUT, verify=VERIFY_TLS)
    print('status:', r.status_code)
    try:
        data = r.json()
        if isinstance(data, dict) and 'results' in data:
            print('results count:', len(data['results']))
        else:
            print('items:', len(data) if isinstance(data, list) else type(data))
        pprint(data if isinstance(data, (list, dict)) else str(data)[:1000])
    except Exception:
        print(r.text[:2000])
except Exception as e:
    print('properties request failed:', e)

print('\n== /api/properties/1/ ==')
try:
    r = session.get(f"{API_BASE}/api/properties/1/", timeout=TIMEOUT, verify=VERIFY_TLS)
    print('status:', r.status_code)
    try:
        pprint(r.json())
    except Exception:
        print(r.text[:2000])
except Exception as e:
    print('property 1 request failed:', e)

print('\n== LOGOUT ==')
try:
    r = session.post(f"{API_BASE}/api/auth/logout/", timeout=TIMEOUT, verify=VERIFY_TLS)
    print('logout status:', r.status_code)
    try:
        pprint(r.json())
    except Exception:
        print(r.text)
except Exception as e:
    print('logout failed:', e)

print('\nDone.')
