# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Dives', '0002_auto_20150426_0325'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dive',
            name='name',
            field=models.CharField(max_length=20, null=True, blank=True),
            preserve_default=True,
        ),
    ]
