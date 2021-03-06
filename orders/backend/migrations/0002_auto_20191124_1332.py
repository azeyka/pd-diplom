# Generated by Django 2.2.7 on 2019-11-24 10:32

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='verification_uuid',
            field=models.UUIDField(default=uuid.uuid4, verbose_name='Код подтверждения'),
        ),
        migrations.AlterField(
            model_name='category',
            name='name',
            field=models.CharField(default='Неизвестная категория', max_length=40, verbose_name='Название'),
        ),
    ]
