from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('core_api', '0017_conversation_savedsearch_conversationmessage_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='kyc_status',
            field=models.CharField(choices=[('NOT_STARTED', 'Not started'), ('PENDING', 'Pending admin review'), ('VERIFIED', 'Verified'), ('REJECTED', 'Rejected')], default='NOT_STARTED', max_length=20),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='kyc_provider',
            field=models.CharField(blank=True, max_length=40),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='kyc_reference',
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='kyc_rejection_reason',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='listing',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='listing',
            name='facilities',
            field=models.JSONField(blank=True, default=list),
        ),
    ]
