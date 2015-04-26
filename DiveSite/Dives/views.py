import json
from django.http import HttpResponse
from django.shortcuts import render
from django.core import serializers
from Dives.models import DivePlan, Dive

# Create your views here.

def requestDive(request):
    diveplan_ID = request.GET.get('pk')
    d = DivePlan.objects.get(pk=diveplan_ID).dive_set.all()
    serialized = serializers.serialize('json', d)
    return HttpResponse(serialized, content_type="application/json")

def saveDive(request):
    data = request.GET.get('json')
    jsonified = json.loads(data)
    currDivePlan = DivePlan.objects.get(pk=jsonified[0])
    divePlanSize = currDivePlan.dive_set.all().count()
    for i in range(divePlanSize):
        dive = currDivePlan.dive_set.get(dive_id=i+1)
        if len(jsonified) > i+1:
            newInfo = jsonified[i+1]['fields']
            dive.depth = int(newInfo['depth'])
            dive.time  = int(newInfo['time'])
            dive.surface_interval = int(newInfo['surface_interval'])
            dive.save()
        else:
            dive.delete()

    if divePlanSize < len(jsonified)-1:
        intRange = range(divePlanSize, len(jsonified)-1)
        for i in intRange:
            newInfo  = jsonified[i+1]['fields']
            newID    = newInfo['dive_id']
            newTime  = int(newInfo['time'])
            newDepth = int(newInfo['depth'])
            newSI    = int(newInfo['surface_interval'])
            newDive  = Dive(dive_id=newID, time=newTime, depth=newDepth, surface_interval=newSI, diveplan=currDivePlan)
            newDive.save()
            
        return HttpResponse("Bigger")
    else:
        return HttpResponse("OK")
