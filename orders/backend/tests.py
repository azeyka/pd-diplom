from django.test import TestCase, Client, override_settings
from backend.models import User, Contact, Shop, ProductInfo
from django.contrib import auth
import json
from urllib.parse import urlencode
from rest_framework.authtoken.models import Token
from django.http import QueryDict
from orders import settings
from rest_framework.test import APIClient
import yaml
import os
from requests import get

TEST_EMAIL = 'test@dom.com'
TEST_USERNAME = 'test'
TEST_PASS = '123456789Test'
TEST_SHOPNAME = 'TestShop'
CLIENT = APIClient()


class SignUpTestCase(TestCase):
    @override_settings(EMAIL_BACKEND='django.core.mail.backends.dummy.EmailBackend')
    def test_signup(self):
        response = CLIENT.post(
            '/api/registration/', {'username': TEST_USERNAME, 'email': TEST_EMAIL, 'password': TEST_PASS, 'password_repeat': TEST_PASS})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['Status'], True)

    def test_invalid_signup(self):
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
        self.token = Token.objects.create(user=self.u)

    def test_confirm_user(self):
        response = CLIENT.post('/api/confirmation/',
                               {'uuid': self.u.verification_uuid})

        self.u.refresh_from_db()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['Status'], True)
        self.assertEqual(self.u.is_active, True)

    def test_login(self):
        self.u.is_active = True
        self.u.save()
        response = CLIENT.post(
            '/api/login/', {'username': TEST_USERNAME, 'password': TEST_PASS})

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['Status'], True)
        self.assertEqual(data['Info']['token'], self.token.key)


class AccountInfoTestCase(TestCase):
    def setUp(self):
        self.token = None
        self.u = User.objects.create_user(TEST_USERNAME, TEST_EMAIL, TEST_PASS)
        self.u.is_active = True
        self.u.save()
        self.token = Token.objects.create(user=self.u)
        self.contact = Contact.objects.create(
            user=self.u, city='Saint-Petersburg', street='Zenitchikov', house=3, phone='895555555555')

    def test_get_info(self):
        response = CLIENT.get(
            '/api/info/', HTTP_AUTHORIZATION=f'Token {self.token.key}')

        data = response.json()
        self.assertEqual(data['Status'], True)
        self.assertEqual(data['Info']['username'], self.u.username)
        self.assertEqual(data['Info']['email'], self.u.email)
        self.assertEqual(data['Info']['type'], self.u.type)

    def test_change_info(self):
        response = CLIENT.put(
            '/api/info/',
            {'first_name': 'Test Name', 'last_name': 'Test Surname'},
            HTTP_AUTHORIZATION=f'Token {self.token.key}'
        )

        self.u.refresh_from_db()
        self.assertEqual(response.json()['Status'], True)
        self.assertEqual(self.u.first_name, 'Test Name')
        self.assertEqual(self.u.last_name, 'Test Surname')

    def test_create_contact(self):
        response = CLIENT.post(
            '/api/contact/',
            {'city': 'Moscow', 'street': 'Volkova',
             'house': '1', 'phone': '+71111111111'},
            HTTP_AUTHORIZATION=f'Token {self.token.key}'
        )

        data = response.json()
        self.assertEqual(data['Status'], True)
        self.assertEqual(data['Info']['user'], self.u.id)

    def test_get_contacts(self):
        response = CLIENT.get(
            '/api/contact/', HTTP_AUTHORIZATION=f'Token {self.token.key}')
        data = response.json()
        self.assertEqual(data['Status'], True)
        self.assertEqual(type(data['Info']), list)

    def test_change_contact(self):
        response = CLIENT.put(
            '/api/contact/',
            {'id': '1', 'city': 'Moscow'},
            HTTP_AUTHORIZATION=f'Token {self.token.key}')

        data = response.json()

        self.assertEqual(data['Status'], True)
        self.assertEqual(data['Info']['city'], 'Moscow')

    def test_delete_contact(self):
        del_response = CLIENT.delete(
            '/api/contact/',
            {'id': '1'},
            HTTP_AUTHORIZATION=f'Token {self.token.key}'
        )
        self.assertEqual(del_response.json()['Status'], True)

        get_response = CLIENT.get(
            '/api/contact/', HTTP_AUTHORIZATION=f'Token {self.token.key}')

        self.assertEqual(len(get_response.json()['Info']), 0)


class ShopTestCase(TestCase):
    def setUp(self):
        self.u = User.objects.create_user(TEST_USERNAME, TEST_EMAIL, TEST_PASS)
        self.u.is_active = True
        self.u.save()
        self.token = Token.objects.create(user=self.u)

    def test_register_and_deleteShop(self):
        response = CLIENT.post(
            '/api/partner/',
            {'agreement': True, 'name': TEST_SHOPNAME},
            HTTP_AUTHORIZATION=f'Token {self.token.key}'
        )

        self.u.refresh_from_db()
        self.assertEqual(self.u.type, 'shop')

        response = CLIENT.delete(
            '/api/partner/',
            HTTP_AUTHORIZATION=f'Token {self.token.key}'
        )

        self.u.refresh_from_db()
        self.assertEqual(self.u.type, 'buyer')


class ShopTestCase(TestCase):
    def setUp(self):
        self.u = User.objects.create_user(TEST_USERNAME, TEST_EMAIL, TEST_PASS)
        self.u.is_active = True
        self.u.save()
        self.token = Token.objects.create(user=self.u)
        self.shop = Shop.objects.create(user=self.u, name=TEST_SHOPNAME)

    def test_get_shop_info_owner(self):
        response = CLIENT.post(
            '/api/partner_info/',
            HTTP_AUTHORIZATION=f'Token {self.token.key}'
        )

        data = response.json()
        self.assertEqual(data['Status'], True)
        self.assertEqual(data['Info']['user'], self.u.id)

    def test_get_shop_info_ID(self):
        response = CLIENT.post(
            '/api/partner_info/',
            {'id': 1}
        )

        data = response.json()
        self.assertEqual(data['Status'], True)
        self.assertEqual(data['Info']['user'], self.u.id)

    def test_change_shop_info(self):
        response = CLIENT.put(
            '/api/partner_info/',
            {'name': 'Shop'},
            HTTP_AUTHORIZATION=f'Token {self.token.key}'
        )
        data = response.json()
        self.assertEqual(data['Status'], True)
        self.assertEqual(data['Info']['name'], 'Shop')


class ProductTestCase(TestCase):
    fixtures = ['backend/test_data/fixtures.json']

    def setUp(self):
        self.u = User.objects.get(username='test_seller')
        self.token = Token.objects.get(user=self.u)
        self.product = ProductInfo.objects.select_related(
            'product', 'product__category').get(product__name='Test product')

    def test_add_product_text(self):
        data = {
            'goods': [
                {
                    'id': 1284469,
                    'category': 'Телевизоры',
                    'model': 'DEXP M22D7200E',
                    'name': '32" (85 см) Телевизор LED DEXP M22D7200E черный',
                    'price': 9500,
                    'price_rrc': 10499,
                    'quantity': 22,
                    'parameters': {
                        "Диагональ (дюйм)": 32,
                        "Разрешение (пикс)": '1920х1080',
                        "Тип экрана": 'Direct LED',
                        "Формат экрана": '16:9'
                    }
                }
            ]
        }

        yaml_data = yaml.dump(data)
        response = CLIENT.post(
            '/api/partner_products/',
            {'yaml': yaml_data},
            HTTP_AUTHORIZATION=f'Token {self.token.key}'
        )

        self.assertEqual(response.json()['Status'], True)

    def test_add_product_file(self):
        with open('backend/test_data/yamlExample.yaml', 'r', encoding='utf-8') as file:
            response = CLIENT.post(
                '/api/partner_products/',
                {'file': file},
                HTTP_AUTHORIZATION=f'Token {self.token.key}'
            )
        self.assertEqual(response.json()['Status'], True)

    @override_settings(CELERY_ALWAYS_EAGER=True,
                       CELERY_EAGER_PROPAGATES_EXCEPTIONS=True,
                       BROKER_BACKEND='memory')
    def test_change_product(self):
        self.assertEqual(self.product.product.name, 'Test product')

        data = {
            'goods': [
                {
                    'id': 1,
                    'category': self.product.product.category.name,
                    'model': self.product.model,
                    'name': 'Test product changed',
                    'price': self.product.price,
                    'price_rrc': self.product.price_rrc,
                    'quantity': self.product.quantity,
                    'parameters': {}
                }
            ]
        }

        yaml_data = yaml.dump(data)
        print(yaml_data)
        response = CLIENT.post(
            '/api/partner_products/',
            {'yaml': yaml_data},
            HTTP_AUTHORIZATION=f'Token {self.token.key}'
        )

        print(response.json())

        self.assertEqual(response.json()['Status'], True)
        # self.product.product.refresh_from_db()
        self.product = ProductInfo.objects.select_related(
            'product', 'product__category').get(product__name='Test product')
        self.assertEqual(self.product.product.name, 'Test product changed')

    def test_delete_product(self):
        pass

    def test_get_product(self):
        pass


class CategoryTestCase(TestCase):
    def setUp(self):
        self.u = User.objects.create_user(TEST_USERNAME, TEST_EMAIL, TEST_PASS)
        self.u.is_active = True
        self.u.save()
        self.token = Token.objects.create(user=self.u)
        self.shop = Shop.objects.create(user=self.u, name=TEST_SHOPNAME)

    def test_get_category(self):
        pass


class CartTestCase(TestCase):
    def setUp(self):
        pass

    def test_get_cart(self):
        pass

    def test_add_to_cart(self):
        pass


class OrderTestCase(TestCase):
    def setUp(self):
        pass

    def test_get_orders(self):
        pass

    def test_create_order(self):
        pass

    def test_change_order_status(self):
        pass
