from .models import Stay, Score
from rest_framework import serializers
from users.models import CustomUser
from users.serializers import CustomUserSerializer


class StaySerializer(serializers.ModelSerializer):

    dogs = serializers.JSONField(required=True, initial=dict)
    owner_id = serializers.IntegerField(source='owner.id')
    sitter_id = serializers.IntegerField(source='sitter.id')

    class Meta:
        model = Stay
        fields = ['id', 'rating', 'review', 'start_date', 'end_date', 'dogs', 'owner_id', 'sitter_id']

    def create(self, data):
        owner = CustomUser.objects.get(pk=data.pop('owner')['id'])
        sitter = CustomUser.objects.get(pk=data.pop('sitter')['id'])
        stay = Stay.objects.create(owner=owner, sitter=sitter, **data)
        return stay


class ScoreSerializer(serializers.ModelSerializer):

    ratings = serializers.FloatField(required=False, allow_null=True)
    sitter = CustomUserSerializer(read_only=True)

    class Meta:
        model = Score
        fields = ['sitter', 'ratings', 'overall']
