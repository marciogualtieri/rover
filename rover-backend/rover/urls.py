from allauth.account.views import confirm_email, password_reset_from_key
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls import handler404


urlpatterns = [
    path('admin/', admin.site.urls),
    path('reviews/v1/', include('reviews.urls')),
    path('users/', include('users.urls')),
    re_path(r'^', include('django.contrib.auth.urls')),
    re_path(r'^rest-auth/', include('rest_auth.urls')),
    re_path(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
    re_path(r'^account/', include('allauth.urls')),
    re_path(r'^accounts-rest/registration/account-confirm-email/(?P<key>.+)/$', confirm_email,
            name='account_confirm_email'),
]
