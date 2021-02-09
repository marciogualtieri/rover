import django.core.exceptions as core_exceptions
import rest_framework.exceptions as rest_framework_exceptions
from rest_framework import viewsets
from django.http import HttpResponseNotFound
import json

from .models import Stay, Score
from .serializers import StaySerializer, ScoreSerializer
from .validators import validate_rating


class StayViewSet(viewsets.ModelViewSet):
    queryset = Stay.objects.all()
    serializer_class = StaySerializer


class ScoreViewSet(viewsets.ModelViewSet):
    queryset = Score.objects.order_by('-overall').all()
    serializer_class = ScoreSerializer

    def get_queryset(self):
        cutoff = self.request.query_params.get('cutoff')
        if cutoff is None:
            return self.queryset
        self._validate_cutoff(cutoff)
        return self.queryset.filter(ratings__gte=float(cutoff))

    @staticmethod
    def _validate_cutoff(cutoff):
        try:
            cutoff = float(cutoff)
            validate_rating(cutoff)
        except core_exceptions.ValidationError as e:
            raise rest_framework_exceptions.ValidationError({'cutoff': e.messages})
