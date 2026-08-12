import json
import urllib.request
import urllib.error
import http.cookiejar

API_BASE = 'https://api.aysmartinvestmentltd.com'
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'AySmartAdmin!2026'

jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))


def post(path, data):
    req = urllib.request.Request(API_BASE + path, data=json.dumps(data).encode('utf-8'), method='POST')
    req.add_header('Content-Type', 'application/json')
    try:
        with opener.open(req, timeout=30) as resp:
            return resp.status, resp.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')
    except Exception as e:
        return 0, f'EXCEPTION: {e}'


def get(path):
    req = urllib.request.Request(API_BASE + path)
    try:
        with opener.open(req, timeout=30) as resp:
            return resp.status, resp.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')
    except Exception as e:
        return 0, f'EXCEPTION: {e}'


def main():
    print('=== LOGIN ADMIN ===')
    code, body = post('/api/auth/login-cookie/', {'username': ADMIN_USERNAME, 'password': ADMIN_PASSWORD})
    print('login:', code)
    print(body)
    print('cookies:', [f'{c.name}={c.value}' for c in jar])
    print('-' * 80)

    print('=== AUTH ME ===')
    code, body = get('/api/auth/me/')
    print('me:', code)
    print(body)
    print('-' * 80)

    print('=== PROPERTIES LIST ===')
    code, body = get('/api/properties/')
    print('properties:', code)
    print(body)
    print('-' * 80)

    print('=== PROPERTIES DETAIL 1 ===')
    code, body = get('/api/properties/1/')
    print('property 1:', code)
    print(body)
    print('-' * 80)

    print('=== LOGOUT ===')
    code, body = post('/api/auth/logout/', {})
    print('logout:', code)
    print(body)
    print('cookies after logout:', [f'{c.name}={c.value}' for c in jar])


if __name__ == '__main__':
    main()
