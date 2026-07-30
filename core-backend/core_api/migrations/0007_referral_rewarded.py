# Generated manually: add rewarded boolean to Referral
from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('core_api', '0006_paymenttransaction'),
    ]

    operations = [
        migrations.AddField(
            model_name='referral',
            name='rewarded',
            field=models.BooleanField(default=False),
        ),
    ]
