from rest_framework import status
from rest_framework.test import APITestCase
import json
import logging
from datetime import datetime
from copy import deepcopy

from .models import Stay, Score

logger = logging.getLogger(__name__)


class TestUtils:
    VALID_TEST_STAY = {
        'rating': 5,
        'review': "Life; it's literally all we have. But is it any good? I'm a reviewer, but I don't review food, "
                  "books, or movies. I review life itself.",
        'start_date': "2013-02-26 00:00:00+00:00",
        'end_date': "2013-04-08 00:00:00+00:00",
        'owner_id': 1,
        'sitter_id': 2,
        'dogs': ['cocaine', '30pancakes']
    }

    TEST_STAY_MISSING_FIELDS = {}
    TEST_STAY_MISSING_FIELDS_EXPECTED_RESPONSE = {"rating": ["This field is required."],
                                                  "review": ["This field is required."],
                                                  "dogs": ["This field is required."],
                                                  "owner_id": ["This field is required."],
                                                  "sitter_id": ["This field is required."]}

    TEST_STAY_WITH_INVALID_FIELD_TYPE = deepcopy(VALID_TEST_STAY)
    TEST_STAY_WITH_INVALID_FIELD_TYPE['rating'] = 'A-Ok'
    TEST_STAY_WITH_INVALID_FIELD_TYPE_EXPECTED_RESPONSE = {'rating': ['A valid integer is required.']}

    TEST_STAY_WITH_INVALID_FIELD_VALUE = deepcopy(VALID_TEST_STAY)
    TEST_STAY_WITH_INVALID_FIELD_VALUE['rating'] = 50
    TEST_STAY_WITH_INVALID_FIELD_VALUE_EXPECTED_RESPONSE = {
        'rating': ['A valid decimal in the range [0, 5] is required.']
    }

    @staticmethod
    def _decode_content(response):
        return response.content.decode('utf-8')

    @staticmethod
    def _model_to_dictionary(model_object, exclusions):
        dictionary = model_object.__dict__
        for exclusion in exclusions + ['_state']:
            dictionary.pop(exclusion, None)
        dictionary = json.dumps(dictionary, default=str)
        return json.loads(dictionary)

    def _parse_response_content(self, response):
        return json.loads(self._decode_content(response))


class StayViewSetTests(APITestCase, TestUtils):
    fixtures = ['test_users.json']
    maxDiff = None

    def test_create_stay(self):
        response = self._post_stay(self.VALID_TEST_STAY)
        stay = Stay.objects.filter(owner_id=1, sitter_id=2).first()
        self.assertEqual(self._model_to_dictionary(stay, exclusions=['id']),
                         self.VALID_TEST_STAY)

    def test_create_stay_missing_fields(self):
        response = self._post_stay(self.TEST_STAY_MISSING_FIELDS)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self._parse_response_content(response), self.TEST_STAY_MISSING_FIELDS_EXPECTED_RESPONSE)

    def test_create_stay_invalid_type_field(self):
        response = self._post_stay(self.TEST_STAY_WITH_INVALID_FIELD_TYPE)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self._parse_response_content(response),
                         self.TEST_STAY_WITH_INVALID_FIELD_TYPE_EXPECTED_RESPONSE)

    def test_create_stay_invalid_type_value(self):
        response = self._post_stay(self.TEST_STAY_WITH_INVALID_FIELD_VALUE)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self._parse_response_content(response),
                         self.TEST_STAY_WITH_INVALID_FIELD_VALUE_EXPECTED_RESPONSE)

    def test_stay_updates_score_first_stay(self):
        self._post_stay(self.VALID_TEST_STAY)
        score = Score.objects.filter(sitter_id=2).first()
        self.assertIsNotNone(score)
        self.assertAlmostEqual(score.ratings, 5.0)
        self.assertAlmostEqual(score.overall, 2.980769230769231)

    def test_stay_updates_score_multiple_stays_less_than_ten(self):
        self._post_stays(self.VALID_TEST_STAY, 9)
        score = Score.objects.filter(sitter_id=2).first()
        self.assertIsNotNone(score)
        self.assertAlmostEqual(score.ratings, 5.0)
        self.assertAlmostEqual(score.overall, 4.596153846153846)

    def test_stay_updates_score_ten_stays(self):
        self._post_stays(self.VALID_TEST_STAY, 10)
        score = Score.objects.filter(sitter_id=2).first()
        self.assertIsNotNone(score)
        self.assertAlmostEqual(score.ratings, 5.0)
        self.assertAlmostEqual(score.overall, 5.0)

    def _post_stay(self, stay):
        response = self.client.post('/reviews/v1/stays/', stay, format='json')
        logger.debug('RESPONSE: %s', response.content)
        return response

    def _post_stays(self, stay, times):
        for _ in range(0, times):
            self._post_stay(stay)


class ScoreViewSetTests(APITestCase, TestUtils):
    fixtures = ['test_users.json']
    maxDiff = None

    MEL_P_SCORE = {
        "sitter": {"id": 4,
                   "email": "mel.p@gmail.com",
                   "name": "Mel P.",
                   "phone": "+15191086391",
                   "image": "https://images.dog.ceo/breeds/boxer/n02108089_1748.jpg"},
        "ratings": 3.5, "overall": 3.5
    }

    JIM_S_SCORE = {
        "sitter": {"id": 5, "email": "jim.s@gmail.com", "name": "Jim S.",
                   "phone": "+19715860916",
                   "image": "https://images.dog.ceo/breeds/bullterrier-staffordshire/n02093256_4090.jpg"},
        "ratings": 2.75,
        "overall": 2.430769230769231
    }

    SHELLI_K_SCORE = {
        "sitter": {"id": 3, "email": "shelli.k@gmail.com", "name": "Shelli K.",
                   "phone": "+15817557107",
                   "image": "https://images.dog.ceo/breeds/hound-ibizan/n02091244_327.jpg"},
        "ratings": 2.5714285714285716,
        "overall": 2.418269230769231
    }

    ALL_SCORES_EXPECTED_RESPONSE = {
        "count": 3,
        "next": None,
        "previous": None,
        "results": [MEL_P_SCORE, JIM_S_SCORE, SHELLI_K_SCORE]}

    SCORES_FIRST_PAGE_EXPECTED_RESPONSE = {
        "count": 3,
        "next": "http://testserver/reviews/v1/scores/?limit=1&offset=1",
        "previous": None,
        "results": [MEL_P_SCORE]}

    SCORES_SECOND_PAGE_EXPECTED_RESPONSE = {
        "count": 3,
        "next": "http://testserver/reviews/v1/scores/?limit=1&offset=2",
        "previous": "http://testserver/reviews/v1/scores/?limit=1",
        "results": [JIM_S_SCORE]}

    SCORES_LAST_PAGE_EXPECTED_RESPONSE = {
        "count": 3,
        "next": None,
        "previous": "http://testserver/reviews/v1/scores/?limit=1&offset=1",
        "results": [SHELLI_K_SCORE]}

    FILTERED_SCORES_EXPECTED_RESPONSE = {
        "count": 1,
        "next": None,
        "previous": None,
        "results": [MEL_P_SCORE]}

    TEST_SCORE_WITH_INVALID_CUTOFF_EXPECTED_RESPONSE = {'cutoff': ['A valid decimal in the range [0, 5] is required.']}

    def test_get_all_scores(self):
        response = self._get_scores()
        self.assertEqual(self._parse_response_content(response), self.ALL_SCORES_EXPECTED_RESPONSE)

    def test_get_scores_first_page(self):
        response = self._get_scores({'limit': 1})
        self.assertEqual(self._parse_response_content(response), self.SCORES_FIRST_PAGE_EXPECTED_RESPONSE)

    def test_get_scores_second_page(self):
        response = self._get_scores({'limit': 1, 'offset': 1})
        self.assertEqual(self._parse_response_content(response), self.SCORES_SECOND_PAGE_EXPECTED_RESPONSE)

    def test_get_scores_last_page(self):
        response = self._get_scores({'limit': 1, 'offset': 2})
        self.assertEqual(self._parse_response_content(response), self.SCORES_LAST_PAGE_EXPECTED_RESPONSE)

    def test_get_filtered_scores(self):
        response = self._get_scores({'cutoff': 3})
        self.assertEqual(self._parse_response_content(response), self.FILTERED_SCORES_EXPECTED_RESPONSE)

    def test_get_filtered_scores_with_invalid_cutoff(self):
        response = self._get_scores({'cutoff': 50})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self._parse_response_content(response),
                         self.TEST_SCORE_WITH_INVALID_CUTOFF_EXPECTED_RESPONSE)

    def _get_scores(self, parameters=None):
        if parameters is None:
            parameters = {}
        response = self.client.get('/reviews/v1/scores/', parameters, format='json')
        logger.debug('RESPONSE: %s', response.content)
        return response
