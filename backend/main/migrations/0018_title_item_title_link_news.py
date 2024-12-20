# Generated by Django 5.1.1 on 2024-11-01 20:17

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0017_title_alter_item_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='title',
            name='item',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.item', verbose_name='Предмет'),
        ),
        migrations.AddField(
            model_name='title',
            name='link',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Ссылка'),
        ),
        migrations.CreateModel(
            name='News',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(verbose_name='Текст')),
                ('title', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.title', verbose_name='Заголовок')),
            ],
            options={
                'verbose_name': 'Новость',
                'verbose_name_plural': 'Новости',
                'db_table': 'news',
            },
        ),
    ]
