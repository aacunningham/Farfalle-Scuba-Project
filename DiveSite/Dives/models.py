from django.db import models
from datetime import date

from SCUser.models import SCUser


# Create your models here.

class DivePlan(models.Model):
    diver = models.ForeignKey(SCUser)
    name = models.CharField('dive name', max_length=30)
    date = models.DateField(default=date.today())

    def __unicode__(self):
        return self.diver.__unicode__() + ": " + self.name

class DiveManager(models.Manager):
    def create_dive(self, time, depth, surface_interval, diveplan):
        currDivePlan = DivePlan.objects.get(pk=diveplan)
        totalDives = currDivePlan.dive_set.all().count()
        dive_id = str(totalDives)
        dive = self.create(dive_id=dive_id, time=time, depth=depth, surface_interval=surface_interval, diveplan=currDivePlan)
        return dive

class Dive(models.Model):
    dive_id = models.CharField(max_length=20, blank=True, null=True, default="Hello")
    time = models.PositiveSmallIntegerField(default=0)
    depth = models.PositiveSmallIntegerField(default=10)
    surface_interval = models.PositiveSmallIntegerField(default=0)
    diveplan = models.ForeignKey(DivePlan)

    objects = DiveManager()

    def __unicode__(self):
        return self.dive_id
