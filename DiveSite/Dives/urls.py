from django.conf.urls import patterns, include, url
from Dives import views


urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'DiveSite.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^requestDive$', views.requestDive),
    url(r'^saveDive$', views.saveDive),
)
