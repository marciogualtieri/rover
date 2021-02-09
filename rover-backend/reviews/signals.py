from django.core.signals import request_finished
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Stay, Score
from users.models import CustomUser
import re
import string
from django.db.models import Avg

_ENGLISH_LETTERS_PATTERN = re.compile('[^a-zA-Z]')


def _extract_english_letters(value: str):
    return _ENGLISH_LETTERS_PATTERN.sub('', value)


def _sitter_score(sitter):
    def _unique_english_letters_count(value: str):
        unique_english_letters = set(_extract_english_letters(value).lower())
        return len(unique_english_letters)
    return 5 * _unique_english_letters_count(sitter.name) / len(string.ascii_lowercase)


def _sitter_ratings(sitter):
    stays = Stay.objects.filter(sitter=sitter)
    average_ratings = stays.aggregate(Avg('rating')).get('rating__avg')
    if average_ratings > 0:
        return average_ratings
    return None


def _overall_score(sitter):
    stays = Stay.objects.filter(sitter=sitter)
    stays_count = stays.count()
    rating_average = stays.aggregate(Avg('rating')).get('rating__avg')
    if stays_count == 0:
        return _sitter_score(sitter)
    elif stays_count < 10:
        return (_sitter_score(sitter) + rating_average * stays_count) / (stays_count + 1)
    else:
        return rating_average


@receiver(post_save, sender=Stay)
def update_score(sender, instance, **kwargs):
    stay = instance
    sitter = CustomUser.objects.get(pk=stay.sitter.id)
    score = Score(sitter=sitter,
                  ratings=_sitter_ratings(sitter),
                  overall=_overall_score(sitter))
    score.save()
