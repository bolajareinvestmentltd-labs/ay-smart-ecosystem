import uuid
from decimal import Decimal
from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


def _escrow_reference():
    return f"ESC-{uuid.uuid4().hex[:12].upper()}"


class Migration(migrations.Migration):

    dependencies = [
        ('core_api', '0031_userprofile_avatar'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='EscrowRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('listing_id', models.PositiveIntegerField(blank=True, null=True)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=12)),
                ('reason', models.CharField(blank=True, max_length=200)),
                ('status', models.CharField(choices=[('FUNDS_HELD', 'Funds Held'), ('RELEASED', 'Released'), ('CANCELLED', 'Cancelled'), ('DISPUTED', 'Disputed'), ('REFUNDED', 'Refunded')], default='FUNDS_HELD', max_length=20)),
                ('reference', models.CharField(default=_escrow_reference, max_length=80, unique=True)),
                ('admin_review_note', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('released_at', models.DateTimeField(blank=True, null=True)),
                ('buyer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='escrow_buys', to=settings.AUTH_USER_MODEL)),
                ('seller', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='escrow_sells', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='EscrowAuditLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('actor_role', models.CharField(default='buyer', max_length=20)),
                ('action', models.CharField(max_length=40)),
                ('previous_status', models.CharField(blank=True, max_length=20)),
                ('new_status', models.CharField(blank=True, max_length=20)),
                ('note', models.TextField(blank=True)),
                ('amount', models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=12)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('actor', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='escrow_audit_logs', to=settings.AUTH_USER_MODEL)),
                ('escrow', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='audit_logs', to='core_api.escrowrecord')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
