from django.http import HttpResponse
from django.shortcuts import render
from django.core import serializers
from Dives.models import DivePlan, Dive

# Create your views here.

def main(request):
    d = DivePlan.objects.get(pk=1).dive_set.all()
    serialized = serializers.serialize('json', d)
    return HttpResponse(serialized, content_type="application/json")
