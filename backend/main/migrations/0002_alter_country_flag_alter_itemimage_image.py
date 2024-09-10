# Generated by Django 5.1.1 on 2024-09-10 07:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='country',
            name='flag',
            field=models.ImageField(blank=True, null=True, upload_to='media/flags', verbose_name='Флаг'),
        ),
        migrations.AlterField(
            model_name='itemimage',
            name='image',
            field=models.ImageField(upload_to='media/images/', verbose_name='Изображение'),
        ),
    ]