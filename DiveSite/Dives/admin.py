from django import forms
from django.contrib import admin
from Dives.models import DivePlan, Dive

# Register your models here.

class DiveCreationForm(forms.ModelForm):
    class Meta:
        model = Dive
        fields = '__all__'
        widgets = {'dive_id': forms.HiddenInput()}

    def clean(self):
        cleaned_data = super(DiveCreationForm, self).clean()
        curr_dive_plan = cleaned_data.get('diveplan')
        cleaned_data['dive_id'] = str(curr_dive_plan.dive_set.all().count())
        return cleaned_data


class DivePlanAdmin(admin.ModelAdmin):
    fields = ['diver', 'name', 'date',]

class DiveAdmin(admin.ModelAdmin):
    form = DiveCreationForm

    fields = ['dive_id', 'time', 'depth', 'surface_interval', 'diveplan',]

admin.site.register(DivePlan, DivePlanAdmin)
admin.site.register(Dive, DiveAdmin)
