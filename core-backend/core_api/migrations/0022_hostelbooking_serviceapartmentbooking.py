# Generated migration

from django.conf import settings
from decimal import Decimal
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core_api', '0021_alter_listingimage_video_alter_propertyimage_video'),
    ]

    operations = [
        migrations.CreateModel(
            name='HostelBooking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('student_name', models.CharField(max_length=100)),
                ('student_email', models.EmailField(max_length=254)),
                ('student_phone', models.CharField(max_length=20)),
                ('check_in_date', models.DateField()),
                ('check_out_date', models.DateField(blank=True, null=True)),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=12)),
                ('service_fee', models.DecimalField(decimal_places=2, default=Decimal('1500.00'), max_digits=10)),
                ('payment_reference', models.CharField(blank=True, max_length=120, unique=True)),
                ('status', models.CharField(choices=[('PENDING', 'Pending Payment'), ('PAID', 'Payment Received'), ('CONFIRMED', 'Confirmed'), ('ACTIVE', 'Active Stay'), ('COMPLETED', 'Completed'), ('CANCELLED', 'Cancelled')], default='PENDING', max_length=20)),
                ('admin_approved', models.BooleanField(default=False)),
                ('funds_released', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('listing', models.ForeignKey(limit_choices_to={'category': 'Hostel'}, on_delete=django.db.models.deletion.CASCADE, related_name='hostel_bookings', to='core_api.listing')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='hostel_bookings', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='ServiceApartmentBooking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tenant_name', models.CharField(max_length=100)),
                ('tenant_email', models.EmailField(max_length=254)),
                ('tenant_phone', models.CharField(max_length=20)),
                ('check_in_date', models.DateField()),
                ('duration_days', models.PositiveIntegerField()),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=12)),
                ('service_fee', models.DecimalField(decimal_places=2, default=Decimal('1500.00'), max_digits=10)),
                ('payment_reference', models.CharField(blank=True, max_length=120, unique=True)),
                ('status', models.CharField(choices=[('PENDING', 'Pending Payment'), ('PAID', 'Payment Received'), ('CONFIRMED', 'Confirmed'), ('ACTIVE', 'Active Tenancy'), ('COMPLETED', 'Completed'), ('CANCELLED', 'Cancelled')], default='PENDING', max_length=20)),
                ('admin_approved', models.BooleanField(default=False)),
                ('funds_released', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('listing', models.ForeignKey(limit_choices_to={'category': 'Service Apartment'}, on_delete=django.db.models.deletion.CASCADE, related_name='apartment_bookings', to='core_api.listing')),
                ('tenant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='apartment_bookings', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
