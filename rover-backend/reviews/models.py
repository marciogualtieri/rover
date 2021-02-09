from django.db import models
from django.utils import timezone
from users.models import CustomUser
from .validators import validate_rating


class Stay(models.Model):
    rating = models.IntegerField(blank=False, validators=[validate_rating])
    review = models.TextField(blank=False)
    start_date = models.DateTimeField(default=timezone.now, blank=True)
    end_date = models.DateTimeField(default=timezone.now, blank=True)
    sitter = models.ForeignKey(CustomUser, related_name='sitter', on_delete=models.CASCADE)
    owner = models.ForeignKey(CustomUser, related_name='owner', on_delete=models.CASCADE)
    dogs = models.JSONField(default=dict)


class Score(models.Model):
    overall = models.FloatField()
    ratings = models.FloatField(null=True)
    sitter = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
