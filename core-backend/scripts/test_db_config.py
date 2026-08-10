import os
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from core_backend import settings

if __name__ == '__main__':
    raw_db = os.getenv('DATABASE_URL', '').strip()
    if not raw_db:
        print('No DATABASE_URL set')
        sys.exit(1)

    config = settings.build_database_config(raw_db)
    print('DATABASE CONFIG:')
    for key, value in config.items():
        print(f'{key}: {value}')

    options = config.get('OPTIONS', {})
    print('\nOPTIONS:')
    for key, value in options.items():
        print(f'{key}: {value}')
