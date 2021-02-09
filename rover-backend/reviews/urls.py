from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'stays', views.StayViewSet)
router.register(r'scores', views.ScoreViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
