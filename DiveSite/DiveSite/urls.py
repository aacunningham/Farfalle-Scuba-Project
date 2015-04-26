from django.conf.urls import patterns, include, url
from django.contrib import admin
from . import views
from Dives import urls

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'DiveSite.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.index, name='index'),
    url(r'^dives/', include(urls)),
)
