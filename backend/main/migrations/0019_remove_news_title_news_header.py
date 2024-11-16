# Generated by Django 5.1.1 on 2024-11-01 20:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0018_title_item_title_link_news'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='news',
            name='title',
        ),
        migrations.AddField(
            model_name='news',
            name='header',
            field=models.CharField(default='hello', max_length=100, verbose_name='Заголовок'),
            preserve_default=False,
        ),
    ]