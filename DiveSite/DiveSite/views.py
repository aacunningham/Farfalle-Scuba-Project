from django.http import HttpResponse
from django.shortcuts import render
from django.core import serializers
from Dives.models import DivePlan, Dive

# Create your views here.

def index(request):
    return render(request, 'index.html', {})
