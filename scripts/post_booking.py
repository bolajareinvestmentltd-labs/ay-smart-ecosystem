import json
from urllib.request import Request, urlopen
url = 'http://127.0.0.1:8000/api/inspections/'
data = {
    'property': 1,
    'preferred_date': '2026-08-20',
    'client_name': 'Automated Test',
    'client_phone': '+2348000000000'
}
req = Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
resp = urlopen(req)
print(resp.read().decode('utf-8'))
