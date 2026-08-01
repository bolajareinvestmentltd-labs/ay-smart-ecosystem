import json
import re
import time
import random
from django.core.management.base import BaseCommand
from django.test import Client
from django.core import mail
from django.contrib.auth import get_user_model
from core_api.models import UserProfile

User = get_user_model()

class Command(BaseCommand):
    help = 'Run a registration -> email verification smoke test using the Django test client and locmem email backend.'

    def handle(self, *args, **options):
        client = Client()
        timestamp = int(time.time())
        unique = random.randint(1000, 9999)
        username = f'testuser_{timestamp}_{unique}'
        email = f'{username}@example.com'
        password = 'Testpass123!'

        self.stdout.write(f'Creating test user: {username} / {email}')
        resp = client.post('/api/auth/register/', json.dumps({
            'username': username,
            'email': email,
            'password': password,
        }), content_type='application/json')

        self.stdout.write(f'Register response: {resp.status_code} {resp.content[:200]!r}')
        if resp.status_code not in (200, 201):
            self.stderr.write('Registration failed, aborting smoke test.')
            return

        # Inspect the in-memory email outbox
        if not mail.outbox:
            self.stderr.write('No emails found in outbox. Ensure EMAIL_BACKEND is locmem for this test.')
            return

        msg = mail.outbox[-1]
        self.stdout.write(f'Captured email subject: {msg.subject}')
        body = msg.body or ''

        # Try to extract uid and token from the email body
        uid_match = re.search(r'uid=([^&\s]+)', body)
        token_match = re.search(r'token=([^&\s]+)', body)

        if not uid_match or not token_match:
            self.stderr.write('Could not parse uid/token from email body. Email body:')
            self.stderr.write(body)
            return

        uid = uid_match.group(1)
        token = token_match.group(1)
        self.stdout.write(f'Parsed uid={uid} token={token}')

        # Call the verification endpoint
        vresp = client.post('/api/auth/verify-email/', json.dumps({'uid': uid, 'token': token}), content_type='application/json')
        self.stdout.write(f'Verify response: {vresp.status_code} {vresp.content[:200]!r}')
        if vresp.status_code != 200:
            self.stderr.write('Verification endpoint returned an error.')
            return

        # Confirm profile is marked verified
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            self.stderr.write('User not found after registration.')
            return

        profile = UserProfile.objects.filter(user=user).first()
        if not profile:
            self.stderr.write('UserProfile does not exist for the test user.')
            return

        if getattr(profile, 'email_verified', False):
            self.stdout.write(self.style.SUCCESS('Smoke test succeeded: email verified and profile updated.'))
        else:
            self.stderr.write('Smoke test failed: profile.email_verified is False.')

        # Now test resend endpoint: first create another user and call resend
        email2 = f'{username}_resend@example.com'
        username2 = f'{username}_resend'
        resp2 = client.post('/api/auth/register/', json.dumps({'username': username2, 'email': email2, 'password': password}), content_type='application/json')
        self.stdout.write(f'Register (resend test) response: {resp2.status_code}')
        # For automated testing, backdate the last_verification_sent_at to bypass cooldown
        try:
            from django.utils import timezone
            from datetime import timedelta
            user2 = User.objects.get(username=username2)
            profile2, _ = UserProfile.objects.get_or_create(user=user2)
            profile2.last_verification_sent_at = timezone.now() - timedelta(seconds=120)
            profile2.save(update_fields=['last_verification_sent_at'])
        except Exception:
            pass
        # Clear outbox then call resend
        mail.outbox.clear()
        rresp = client.post('/api/auth/resend-verification/', json.dumps({'email': email2}), content_type='application/json')
        self.stdout.write(f'Resend response: {rresp.status_code} {rresp.content[:200]!r}')
        if rresp.status_code != 200:
            self.stderr.write('Resend endpoint failed.')
            return

        if not mail.outbox:
            self.stderr.write('Resend did not send any email.')
            return

        self.stdout.write(self.style.SUCCESS('Resend endpoint succeeded and email was sent.'))
