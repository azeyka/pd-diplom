from django.test import TestCase, Client
from backend.models import User
from django.contrib import auth
import json
from rest_framework.authtoken.models import Token

TEST_EMAIL = 'test@dom.com'
TEST_USERNAME = 'test'
TEST_PASS = '123456789Test'
CLIENT = Client()


class SignUpTestCase(TestCase):
    def testSighUp(self):
        response = CLIENT.post(
            '/api/registration/', {'username': TEST_USERNAME, 'email': TEST_EMAIL, 'password': TEST_PASS, 'password_repeat': TEST_PASS})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['Status'], True)

    def testInvalidSignUp(self):
        response = CLIENT.post(
            '/api/registration/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['Status'], False)

        self.assertEqual(
            response.json()['Errors'].__contains__('password'), True)
        self.assertEqual(response.json()['Errors'].__contains__(
            'password_repeat'), True)
        self.assertEqual(response.json()['Errors'].__contains__('email'), True)
        self.assertEqual(
            response.json()['Errors'].__contains__('username'), True)


class AuthTestCase(TestCase):
    def setUp(self):
        self.token = None
        self.u = User.objects.create_user(TEST_USERNAME, TEST_EMAIL, TEST_PASS)
        self.u.is_active = True
        self.u.save()
        self.token = Token.objects.create(user=self.u)

    def testLogin(self):
        response = CLIENT.post(
            '/api/login/', {'username': TEST_USERNAME, 'password': TEST_PASS})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['Status'], True)
        self.assertEqual(response.json()['Info']['token'], self.token.key)
