# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Dives', '0003_auto_20150426_0419'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dive',
            name='name',
        ),
        migrations.AddField(
            model_name='dive',
            name='dive_id',
            field=models.CharField(default=b'Hello', max_length=20, null=True, blank=True),
            preserve_default=True,
        ),
    ]
