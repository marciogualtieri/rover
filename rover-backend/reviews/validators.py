from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_rating(value):
    if value < 0 or value > 5:
        raise ValidationError(_('A valid decimal in the range [0, 5] is required.'))
