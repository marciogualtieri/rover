from django.urls import include, path

from . import views

urlpatterns = [
    path('verified/', views.verified_message),
]
