# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Dives', '0004_auto_20150426_0630'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dive',
            name='depth',
            field=models.PositiveSmallIntegerField(default=100),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='dive',
            name='dive_id',
            field=models.PositiveSmallIntegerField(default=0, null=True, blank=True),
            preserve_default=True,
        ),
    ]
