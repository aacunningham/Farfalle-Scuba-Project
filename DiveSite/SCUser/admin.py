from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField

from SCUser.models import SCUser

# Register your models here.

class UserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation',
        widget=forms.PasswordInput)

    class Meta:
        model = SCUser
        fields = ('email', 'first_name', 'last_name')

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords do not match")
        return password2

    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = SCUser
        fields = '__all__'

    def clean_password(self):
        return self.initial["password"]


class SCUserAdmin(UserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ('email', 'first_name', 'last_name', 'is_staff')
    list_filter = ('is_staff',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 
                         'groups', 'user_permissions')}),
        ('Times', {'fields': ('last_login', 'date_joined')}),
    )
    readonly_fields = ['last_login', 'date_joined']
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2')}
        ),
    )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email', 'first_name', 'last_name', 'is_staff')
    filter_horizontal = ('groups', 'user_permissions')



admin.site.register(SCUser, SCUserAdmin)
