from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from yaml import load as load_yaml, Loader
from requests import get

from backend.modules.send_email import send_email
from backend.modules.create_pdf import Pdf

from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

from django.utils.translation import activate, ugettext as _
from backend.models import User, ConformaionCode, Contact, Shop, Category, ProductInfo, Product, Parameter, \
    ProductParameter, CartItem, Order, OrderItem, Cart
from backend.serializers import UserSerializer, ContactSerializer, CategorySerializer, ProductInfoSerializer, \
    ShopSerializer, OrderSerializer, CartSerializer


class UserView(APIView):
    """
        Класс для регистрации и удаления пользователя
    """

    # регистрация нового пользователя
    def post(self, request, *args, **kwargs):
        errors_dict = {}
        required_fields = ['password', 'password_repeat', 'email', 'username']

        for field_name in required_fields:
            # Проверка наличия необходимых аргументов
            field = request.data.get(field_name)
            if not field:
                errors_dict[field_name] = 'Необходимо заполнить.'

            # Проверка пароля
            if field_name == 'password':
                try:
                    validate_password(request.data['password'])
                except Exception as e:
                    errors_list = []
                    for error in e:
                        activate('ru')
                        errors_list.append(_(error))
                    errors_dict['password'] = errors_list

            # Проверка повтора пароля на совпадение с паролем
            elif field_name == 'password_repeat':
                if request.data['password']:
                    if not request.data['password'] == request.data['password_repeat']:
                        errors_dict['password_repeat'] = 'Пароли не совпадают.'
                else:
                    errors_dict['password_repeat'] = 'Сначала придумайте пароль.'

            # Проверка уникальности логина
            elif field_name == 'username':
                if User.objects.filter(username=request.data['username']):
                    errors_dict['username'] = 'Пользоваетль с таким именем уже существует.'

            # Проверка уникальности email
            elif field_name == 'email':
                if User.objects.filter(email=request.data['email']):
                    errors_dict['email'] = 'Пользоваетль с таким email уже существует.'

        # Если словарь с ошибками не пуст, то отправляем его ответ
        if errors_dict:
            return JsonResponse({'Status': False, 'Errors': errors_dict})

        # Если ошибок нет, то соханяем пользователя, создаем для него токен авторизации
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            # Сохранение пользователя
            user = serializer.save()
            user.set_password(request.data['password'])
            if 'firstname' in request.data:
                user.first_name = request.data['firstname']
            if 'lastname' in request.data:
                user.last_name = request.data['lastname']
            user.save()

            # Создание токена
            Token.objects.get_or_create(user=user)

            return JsonResponse({'Status': True})
        else:
            return JsonResponse({'Status': False, 'Errors': serializer.errors})

    # удаление пользователя
    def delete(self, request, *args, **kwargs):
        # Проверка авторизован ли пользователь
        if not request.user.is_authenticated:
            return JsonResponse({'Status': False, 'Errors': 'Пользователь не авторизован'})

        if request.user.type == 'shop':
            shop = Shop.objects.get(user=request.user)
            if not shop.state:
                return JsonResponse({'Status': False, 'Errors': 'Есть не завершенные заказы'})

        request.user.delete()
        return JsonResponse({'Status': True})


class SendConfirmCode(APIView):
    """
        Класс для отправки кода подтверждения на почту
    """

    def post(self, request, *args, **kwargs):
        # Проверка наличия имени пользователя
        username = request.data.get('username')
        if not username:
            return JsonResponse({'Status': False, 'Errors': 'Не указаны все необходимые аргументы'})

        # Проверка существует ли пользователь с именем
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({'Status': False, 'Errors': 'Пользоваетля с таким именем не существует.'})

        # Создание кода подтверждения
        code, _ = ConformaionCode.objects.get_or_create(user=user)
        code.set()
        code.save()

        # Отправка кода на почту
        send_email(
            'Подтверждение почты',
            f'Ваш код подтверждения: {code.code}',
            [user.email])

        return JsonResponse({'Status': True})


class ConfirmEmail(APIView):
    """
        Класс для активации аккаунта с помощью кода подтвержения из email
    """

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        code = request.data.get('code')

        # Проверка наличия необходимых аргументов
        if not username or not code:
            return JsonResponse({'Status': False, 'Errors': 'Не заполнены необходимые поля.'})

        # Проверка существует ли пользователь с таким именем
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({'Status': False, 'Errors': 'Пользоваетля с таким именем не существует.'})

        # Проверка токена
        try:
            ConformaionCode.objects.get(user=user, code=code)
        except ConformaionCode.DoesNotExist:
            return JsonResponse({'Status': False, 'Errors': 'Неверный код подтверждения.'})

        # Активация пользователя
        user.is_active = True
        user.save()

        return JsonResponse({'Status': True})


class LogIn(APIView):
    """
        Класс для авторизации пользователя с помощью токена
    """

    def post(self, request, *args, **kwargs):
        # Проверяем заполнено ли имя пользователя
        username = request.data.get('username')
        if not username:
            return JsonResponse({'Status': False, 'Errors': {'username': 'Необходимо заполнить.'}})

        # Проверяем существует ли пользователь с таким имененем
        try:
            user = User.objects.get(username=request.data['username'])
        except User.DoesNotExist:
            return JsonResponse({'Status': False, 'Errors': 'Пользоваетля с таким именем не существует.'})

        # Проверяем заполнен ли пароль
        password = request.data.get('password')
        if not password:
            return JsonResponse({'Status': False, 'Errors': {'password': 'Необходимо заполнить.'}})

        # Проверка активтрован ли пользователь
        if not user.is_active:
            return JsonResponse({'Status': False, 'Errors': 'Ваш аккаунт не активирован.'})

        # Аунтефикация пользователя
        user = authenticate(request, username=request.data['username'], password=request.data['password'])

        if user is not None:
            # Отправляем в ответ токен
            token = Token.objects.get(user=user)
            return JsonResponse({'Status': True, 'Info': {'token': token.key}})
        else:
            return JsonResponse({'Status': False, 'Errors': 'Не правильный пароль.'})


class AccountInfo(APIView):
    """
        Класс для получения и редактирования информации о пользователе
    """

    # получить информацию
    def get(self, request, *args, **kwargs):
        # Проверка авторизован ли пользователь
        if not request.user.is_authenticated:
            return JsonResponse({'Status': False, 'Errors': 'Пользователь не авторизован'})

        serializer = UserSerializer(request.user)
        return JsonResponse({'Status': True, 'Info': serializer.data})

    # изменить информацию
    def put(self, request, *args, **kwargs):
        # Проверка авторизован ли пользователь
        if not request.user.is_authenticated:
            return JsonResponse({'Status': False, 'Errors': 'Пользователь не авторизован'})

        # Изменение данных
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'Status': True, 'Info': serializer.data})
        else:
            return JsonResponse({'Status': False, 'Errors': serializer.errors})


class AccountContacts(APIView):
    """
        Класс для получения, удаления, добавления и редактирования контактных данных пользователя
    """

    # получить контакты
    def get(self, request, *args, **kwargs):
        # Проверка авторизован ли пользователь
        if not request.user.is_authenticated:
            return JsonResponse({'Status': False, 'Errors': 'Пользователь не авторизован'})

        contacts = Contact.objects.filter(user=request.user)
        serializer = ContactSerializer(contacts, many=True)
        return JsonResponse({'Status': True, 'Info': serializer.data})

    # добавить новый контакт
    def post(self, request, *args, **kwargs):
        errors_dict = {}
        required_fields = ['city', 'street', 'house', 'phone']

        # Проверка авторизован ли пользователь
        if not request.user.is_authenticated:
            return JsonResponse({'Status': False, 'Errors': 'Пользователь не авторизован'})

        # Проверка наличия необходимых аргументов
        for field_name in required_fields:
            field = request.data.get(field_name)
            if not field:
                errors_dict[field_name] = 'Необходимо заполнить.'

        # Если словарь с ошибками не пуст, отправляем его
        if errors_dict:
            return JsonResponse({'Status': False, 'Errors': errors_dict})

        # Добавляем id пользователя в request.data, так как это необходимо для создания контакта
        request.data._mutable = True
        request.data.update({'user': request.user.id})

        # Создаем контакт
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'Status': True})
        else:
            return JsonResponse({'Status': False, 'Errors': serializer.errors})

    # удалить контакт
    def delete(self, request, *args, **kwargs):
        # Проверка авторизован ли пользователь
        if not request.user.is_authenticated:
            return JsonResponse({'Status': False, 'Errors': 'Пользователь не авторизован'})

        # Проверка наличия ID контакта
        id = request.data.get('id')
        if not id:
            return JsonResponse({'Status': False, 'Errors': 'Нет ID адреса'})

        # удаление контакта
        try:
            contact = Contact.objects.get(id=id, user=request.user)
            contact.delete()
            return JsonResponse({'Status': True})
        except Contact.DoesNotExist:
            return JsonResponse({'Status': False, 'Errors': 'Адреса с таким ID не существует'})

    # изменить существующий контакт
    def put(self, request, *args, **kwargs):
        # Проверка авторизован ли пользователь
        if not request.user.is_authenticated:
            return JsonResponse({'Status': False, 'Errors': 'Пользователь не авторизован'})

        id = request.data.get('id')
        if id:
            try:
                contact = Contact.objects.get(id=request.data['id'], user=request.user)
                serializer = ContactSerializer(contact, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return JsonResponse({'Status': True})
                else:
                    return JsonResponse({'Status': False, 'Errors': serializer.errors})
            except Contact.DoesNotExist:
                return JsonResponse({'Status': False, 'Errors': 'Адреса с таким ID не существует'})
        else:
            return JsonResponse({'Status': False, 'Errors': 'Нет ID адреса'})


class PartnerView(APIView):
    """
        Класс для регистрации и удаления магазина
    """

    # Регистрация магазина
    def post(self, request, *args, **kwargs):
        # Проверка авторизован ли пользователь
        if not request.user.is_authenticated:
            return JsonResponse({'Status': False, 'Errors': 'Пользователь не авторизован'})

        agreement = request.data.get('agreement')
        name = request.data.get('name')
        url = request.data.get('url')

        # Проверка согласен ли пользователь с какими-нибудь условиями создания магазина
        if not agreement:
            return JsonResponse({'Status': False, 'Errors': {'agreement': 'Необходимо согласиться с условиями'}})

        # Проверка имени магазина на уникальность
        if name:
            shop = Shop.objects.filter(name=name)
            if shop:
                return JsonResponse({'Status': False, 'Errors': {'name': 'Магазин с таким названием уже существует'}})

        # Валидация ссылки на сайт магазина
        if url:
            validate_url = URLValidator()
            try:
                validate_url(url)
            except ValidationError as e:
                return JsonResponse({'Status': False, 'Errors': {'url': str(e)}})

        # Создание магазина
        request.data._mutable = True
        request.data.update({'user': request.user.id})
        serializer = ShopSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            # Меняем статус пользователя на магазин
            request.user.type = 'shop'
            request.user.save()
            return JsonResponse({'Status': True, 'Info': serializer.data})
        else:
            return JsonResponse({'Status': False, 'Errors': serializer.errors})

    # Удаление магазина
    def delete(self, request, *args, **kwargs):
        # Проверка авторизован ли пользователь
        if not request.user.is_authenticated:
            return JsonResponse({'Status': False, 'Errors': 'Пользователь не авторизован'})

        # Проверка есть ли у пользоваетля магазин
        try:
            shop = Shop.objects.get(user=request.user)
        except Shop.DoesNotExist:
            return JsonResponse({'Status': False, 'Errors': 'Только для магазинов'})

        # Проверка завершены ли все заказы магазину
        if not shop.state:
            return JsonResponse({'Status': False, 'Errors': 'Есть не завершенные заказы'})

        # Удаление магазина и изменение статуса на покупателя
        shop.delete()
        request.user.type = 'buyer'
        request.user.save()
        return JsonResponse({'Status': True})


class PartnerInfo(APIView):
    """
        Класс для получения и изменения информации о магазине
    """

    # Получение информации либо о магазине авторизрваного пользователя если он есть, либо по id магазина
    def post(self, request, *args, **kwargs):
        id = request.data.get('id')

        # Проверка авторизован ли пользователь если нет id
        if not id and not request.user.is_authenticated:
            return JsonResponse({'Status': False, 'Errors': 'Пользователь не авторизован'})

        # Проверка существует ли магазин
        if id:
            try:
                shop = Shop.objects.get(id=id)
            except Shop.DoesNotExist:
                return JsonResponse({'Status': False, 'Errors': 'Магазина не существует'})
        else:
            try:
                shop = Shop.objects.get(user=request.user)
            except Shop.DoesNotExist:
                return JsonResponse({'Status': False, 'Errors': 'Магазина не существует'})

        serializer = ShopSerializer(shop)
        return JsonResponse({'Status': True, 'Info': serializer.data})

    # Изменение информации владельцем магазина
    def put(self, request, *args, **kwargs):
        # Проверка авторизован ли пользователь
        if not request.user.is_authenticated:
            return JsonResponse({'Status': False, 'Errors': 'Пользователь не авторизован'})

        errors_dict = {}
        name = request.data.get('name')
        user_shop = Shop.objects.get(user=request.user)

        # Проверка нового имени на уникальность
        if not user_shop.name == name:
            if Shop.objects.filter(name=name):
                errors_dict['name'] = 'Магазин с таким названием уже существует'

        # Валидация ссылки на магазин
        url = request.data.get('url')
        if url:
            validate_url = URLValidator()
            try:
                validate_url(url)
            except ValidationError as e:
                errors_dict['url'] = 'Ссылка не валидна'
        else:
            request.data._mutable = True
            request.data.update({'url': ''})

        # Если словарь с ошибками не пуст, то отправляем его ответ
        if errors_dict:
            return JsonResponse({'Status': False, 'Errors': errors_dict})

        # Если все нормально, то изменяем данные и отправляем
        serializer = ShopSerializer(user_shop, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'Status': True, 'Info': serializer.data})
        else:
            return JsonResponse({'Status': False, 'Errors': serializer.errors})


class ParthnerProducts(APIView):
    """
        Класс для добавления и удаления продуктов
    """

    # Может принимать файл, ссылку на файл или текст в формате yaml
    def post(self, request, *args, **kwargs):
        text = request.data.get('yaml')
        file = request.data.get('file')
        url = request.data.get('url')

        if text:
            stream = text
        elif file:
            stream = file
        elif url:
            validate_url = URLValidator()
            try:
                validate_url(url)
                stream = get(url).content
            except ValidationError as e:
                return JsonResponse({'Status': False, 'Error': str(e)})
        else:
            return JsonResponse({'Status': False, 'Errors': 'Не указаны необходимые аргументы'})

        data = load_yaml(stream, Loader=Loader)
        shop_name = data.get('shop')
        print(shop_name)
        # Если указано название магазина, то ищем магазин с этим названием
        if shop_name:
            try:
                shop = Shop.objects.get(name=shop_name)
            except Shop.DoesNotExist:
                return JsonResponse({'Status': False, 'Errors': 'Магазин с указаным именем не найден.'})
        # Иначе ищем магазин авторизованного пользователя
        else:
            # Проверка авторизован ли пользователь
            if not request.user.is_authenticated:
                return JsonResponse({'Status': False, 'Error': 'Пользователь не авторизован'})

            # Проверка является ли пользователь магазином
            if request.user.type != 'shop':
                return JsonResponse({'Status': False, 'Error': 'Только для магазинов'})

            shop = Shop.objects.get(user_id=request.user.id)

        # Добавление категорий
        for category in data.get('categories'):
            category_object, _ = Category.objects.get_or_create(name=category.get('name'), id=category.get('id'))

        # Добавление товаров
        for item in data.get('goods'):
            try:
                external_id = item.get('id')
                product = Product.objects.get(product_infos__external_id=external_id, product_infos__shop=shop)
                product.name = item.get('name')
                product.category_id = item.get('category')
                product.save()

            except Product.DoesNotExist:
                product = Product.objects.create(name=item.get('name'), category_id=item.get('category'))

            category = Category.objects.get(id=item.get('category'))
            category.shops.add(shop)
            category.save()

            try:
                product_info = ProductInfo.objects.get(product=product)
                product_info.external_id = item.get('id')
                product_info.model = item.get('model')
                product_info.price = item.get('price')
                product_info.price_rrc = item.get('price_rrc')
                product_info.quantity = item.get('quantity')
                product_info.shop = shop
                product_info.save()

            except ProductInfo.DoesNotExist:
                product_info = ProductInfo.objects.create(product_id=product.id,
                                                          external_id=item['id'],
                                                          model=item['model'],
                                                          price=item['price'],
                                                          price_rrc=item['price_rrc'],
                                                          quantity=item['quantity'],
                                                          shop_id=shop.id)

            for name, value in item['parameters'].items():
                parameter_object, _ = Parameter.objects.get_or_create(name=name)
                product_parameter, _ = ProductParameter.objects.get_or_create(product_info_id=product_info.id,
                                                                              parameter_id=parameter_object.id)
                product_parameter.value = value
                product_parameter.save()

        return JsonResponse({'Status': True})

    # Удаление продукта
    def delete(self, request, *args, **kwargs):
        # Проверка авторизован ли пользователь
        if not request.user.is_authenticated:
            return JsonResponse({'Status': False, 'Error': 'Пользователь не авторизован'})

        # Проверка является ли пользователь магазином
        if request.user.type != 'shop':
            return JsonResponse({'Status': False, 'Error': 'Только для магазинов'})

        # Проверка наличия ID продукта
        id = request.data.get('id')
        if not id:
            return JsonResponse({'Status': False, 'Errors': 'Не указан ID продукта'})

        try:
            shop = Shop.objects.get(user=request.user)
            product = Product.objects.get(product_infos__external_id=id, product_infos__shop=shop)

            # Проверка есть ли у этого магазина продукты в этой категории, помимо удаляемого
            another_products_in_category = Product.objects.filter(category=product.category,
                                                                  product_infos__shop=shop).exclude(id=product.id)
            # Если есть, то удаляем у категории этот магазин
            if (another_products_in_category):
                product.category.shops.remove(shop)

            # Удаление продукта
            product.delete()
            return JsonResponse({'Status': True})

        except Product.DoesNotExist:
            return JsonResponse({'Status': False, 'Error': 'Продукта с таким ID не существует'}, status=403)


class CategoryView(APIView):
    """
        Класс для получения списка категорий
    """

    # получение списка всех категорий
    def get(self, request, *args, **kwargs):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return JsonResponse({'Status': True, 'Info': serializer.data})

    # получение списка категорий по id магазина
    def post(self, request, *args, **kwargs):
        # Если передан параметр shop_id, то отправляем категории именно этого магазина, иначе все имеющиеся
        shop_id = request.data.get('shop_id')
        if not shop_id:
            return JsonResponse({'Status': False, 'Error': 'Не передан id магазина'})

        categories = Category.objects.filter(shops__id=shop_id)
        serializer = CategorySerializer(categories, many=True)
        return JsonResponse({'Status': True, 'Info': serializer.data})


class ProductView(APIView):
    """
        Класс для получения списка продуктов
    """

    # Получение списка всех продуктов
    def get(self, request, *args, **kwargs):
        products = ProductInfo.objects.all()
        serializer = ProductInfoSerializer(products, many=True)
        return JsonResponse({'Status': True, 'Info': serializer.data})

    # Получение продуктов по ID, по ID категории или по ID магазина
    def post(self, request, *args, **kwargs):
        category_id = request.data.get('category_id')
        shop_id = request.data.get('shop_id')
        product_id = request.data.get('product_id')

        # Получение продукта по ID
        if product_id:
            products = ProductInfo.objects.filter(id=product_id)

        # Получение продуктов и их фильтрация, если указаны фильтры
        else:
            products = ProductInfo.objects.all()

            if category_id:
                products = products.filter(product__category_id=category_id)

            if shop_id:
                products = products.filter(shop_id=shop_id)

        serializer = ProductInfoSerializer(products, many=True)
        return JsonResponse({'Status': True, 'Info': serializer.data})


class UserCart(APIView):
    """
        Класс для получения корзины пользователя и добавления в нее товаров
    """

    # Получение корзины
    def get(self, request, *args, **kwargs):
        # Проверка авторизован ли пользователь
        if not request.user.is_authenticated:
            return JsonResponse({'Status': False, 'Error': 'Пользователь не авторизован'})

        cart, _ = Cart.objects.get_or_create(user=request.user)

        items = CartItem.objects.filter(cart=cart)
        totalSumm = 0
        for item in items:
            # Изменяем количество товаров на случай если в корзине лежит больше, чем доступно (если кто-то другой купил)
            if item.quantity > item.product_info.quantity:
                item.quantity = item.product_info.quantity
                item.save()

            # Считаем общую сумму товаров
            totalSumm += item.quantity * item.product_info.price_rrc

        serializer = CartSerializer(cart)
        return JsonResponse({'Status': True, 'Info': {'cart': serializer.data, 'totalSumm': totalSumm}})

    # Добавление товаров в корзину
    def post(self, request, *args, **kwargs):
        # Проверка авторизован ли пользователь
        if not request.user.is_authenticated:
            return JsonResponse({'Status': False, 'Error': 'Пользователь не авторизован'})

        # Проверка есть ли ID товара
        id = request.data.get('id')
        if not id:
            return JsonResponse({'Status': False, 'Errors': 'Нет ID товара'})

        # Проверка существует ли товар с таким ID
        try:
            product_info = ProductInfo.objects.get(id=id)
            product_quantity = product_info.quantity
        except Product.DoesNotExist:
            return JsonResponse({'Status': False, 'Error': 'Товара с таким ID не сущетсвует'})

        cart, _ = Cart.objects.get_or_create(user=request.user)
        # Проверка есть ли такой товар в корзине
        try:
            cart_item = CartItem.objects.get(cart=cart, product_info=product_info)
        # Если нет, то создаем и добавляем в корзину
        except CartItem.DoesNotExist:
            cart_item = CartItem.objects.create(cart=cart, product_info=product_info)
            cart.items.add(cart_item)
            cart.save()

        operator = request.data.get('operator')
        count = request.data.get('count')

        # если указан тип, то уменьшаем или увеличиваем колиество товара на 1
        if operator:
            if operator == '-':
                cart_item.quantity -= 1
                cart_item.save()
                remain = product_quantity - cart_item.quantity

                if cart_item.quantity <= 0:
                    cart_item.delete()
                return JsonResponse({'Status': True, 'Info': {'remain': remain, 'quantity': cart_item.quantity}})
            elif operator == '+':
                if cart_item.quantity == product_quantity:
                    return JsonResponse({'Status': False, 'Errors': 'Больше нет товаров для добавления.'})
                elif cart_item.quantity < product_quantity:
                    cart_item.quantity += 1
                    cart_item.save()
                    remain = product_quantity - cart_item.quantity
                    return JsonResponse({'Status': True, 'Info': {'remain': remain, 'quantity': cart_item.quantity}})
            else:
                return JsonResponse({'Status': False, 'Errors': 'Указан неверный оператор.'})

        # если указано количество, то пробуем установить его
        elif count:
            try:
                new_quantity = int(count)
                if new_quantity == 0:
                    cart_item.delete()
                    return JsonResponse(
                        {'Status': True, 'Info': {'remain': product_quantity, 'quantity': new_quantity}})

                if new_quantity > product_quantity:
                    return JsonResponse({'Status': False, 'Errors': 'Нет такого количества товаров.'})

                cart_item.quantity = new_quantity
                cart_item.save()
                remain = product_quantity - cart_item.quantity
                return JsonResponse({'Status': True, 'Info': {'quantity': new_quantity, 'remain': remain}})

            except ValueError:
                return JsonResponse({'Status': False, 'Errors': 'Введено не число.'})
        else:
            return JsonResponse({'Status': False, 'Errors': 'Не указан + или -, либо число'})


class OrderView(APIView):
    """
        Класс для создания заказа и управления его статусом, а также для получения всех имеющихся заказов
    """

    # Получение всех имеющихся заказов
    def get(self, request, *args, **kwargs):
        # Проверка авторизован ли пользователь
        if not request.user.is_authenticated:
            return JsonResponse({'Status': False, 'Error': 'Пользователь не авторизован'})

        # Заказы пользователя
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        info = {'user': serializer.data}

        # Заказы магазина
        if request.user.type == 'shop':
            shop = Shop.objects.get(user=request.user)
            shop_orders = Order.objects.filter(shop=shop)
            shop_serializer = OrderSerializer(shop_orders, many=True)
            info['shop'] = shop_serializer.data

        return JsonResponse({'Status': True, 'Info': info})

    # создание заказа
    def post(self, request, *args, **kwargs):
        # Проверка авторизован ли пользователь
        if not request.user.is_authenticated:
            return JsonResponse({'Status': False, 'Error': 'Пользователь не авторизован'})

        # Проверка есть ли товары в корзине
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_items = CartItem.objects.filter(cart=cart)
        if len(cart_items) == 0:
            return JsonResponse({'Status': False, 'Errors': 'Корзина пуста'})

        # Проверка указан ли адрес
        contact_id = request.data.get('contact')
        if contact_id:
            try:
                contact = Contact.objects.get(id=contact_id)
            except Contact.DoesNotExist:
                return JsonResponse({'Status': False, 'Errors': 'Нет ID адреса, либо адреса с таким ID не существует'})

        prev_order = None
        # Заголовки будущей таблицы для pdf
        table_data = [['', 'Название', 'Цена', 'Кол-во', 'Сумма']]
        # Индекс для нумерации товаров
        i = 0

        for cart_item in cart_items:
            # Создаем отдельный заказ для каждого магазина
            order, is_created = Order.objects.get_or_create(user=request.user, shop=cart_item.product_info.shop,
                                                            external_id=cart.id)

            item = OrderItem.objects.create(order=order, product_info=cart_item.product_info,
                                            quantity=cart_item.quantity)
            order.items.add(item)
            order.total_summ += item.quantity * item.product_info.price_rrc
            order.contact = contact
            order.save()

            # Вычитаем из имеющегося количества продукта столько, сколько было в корзине
            product_info = cart_item.product_info
            product_info.quantity -= cart_item.quantity
            product_info.save()

            # Меняем статус магазину чтобы пользователь не смог удалиться пока не завершил заказ
            shop = product_info.shop
            shop.state = False
            shop.save()

            # Если заказ новый, то нужно создать новый pdf
            if is_created:
                # Если до этого был создан заказ для другого магазина, то завершаем создание pdf и отправляем его на почту
                if prev_order and file:
                    # Завершаем и рисуем таблицу
                    table_data.append(['Итого', '', '', '', f'{prev_order.total_summ} руб.'])
                    file.draw_table(table_data)

                    # Сораняем файл и добавляем ссылку на него в модель
                    file.save()
                    prev_order.order_pdf = file.path
                    prev_order.save()

                    # Отправляем email с накладной магазину
                    send_email('У Вас новый заказ', 'Накладная во вложениях', [prev_order.shop.user.email], [file.path])
                    # И очищаем данные таблицы для следующего заказа
                    table_data = [['', 'Название', 'Цена', 'Кол-во', 'Сумма']]

                # Создаем новый файл
                file = Pdf(order)
                prev_order = order

            # Добавляем запись о товаре в данные таблицы
            i += 1
            quantity = cart_item.quantity
            price = cart_item.product_info.price_rrc
            summ = price * quantity
            table_data.append(
                [
                    i,
                    Paragraph(cart_item.product_info.product.name, ParagraphStyle('paragraph', fontName='Arial')),
                    f'{price} руб.',
                    quantity,
                    f'{summ} руб.'
                ]
            )

            # Удаляем товар из корзины
            cart_item.delete()

        # завершаем создание pdf для последнего заказа и отправляем его на почту
        table_data.append(['Итого', '', '', '', f'{order.total_summ} руб.'])
        file.draw_table(table_data)
        file.save()
        order.order_pdf = file.path
        order.save()
        send_email('У Вас новый заказ', 'Накладная во вложениях', [order.shop.user.email], [file.path])

        # Удаляем корзину
        cart.delete()
        return JsonResponse({'Status': True, 'Info': {'order_id': order.id}})

    # Изменение статуса заказа
    def put(self, request, *args, **kwargs):
        # Проверка авторизован ли пользователь
        if not request.user.is_authenticated:
            return JsonResponse({'Status': False, 'Error': 'Пользователь не авторизован'})

        # Проверка указано ли ID товара и его новый статус
        id = request.data.get('id')
        state = request.data.get('state')
        if not id or not state:
            return JsonResponse({'Status': False, 'Errors': 'Нет id заказа или state'})

        # Проверка ID товара
        try:
            order = Order.objects.get(id=id)
        except Order.DoesNotExist:
            return JsonResponse({'Status': False, 'Errors': 'Заказа с таким id не существует'})

        # Если заказ с new изменяется на confirmed, assembled или sent, отправляем заказчику на почту накадную
        if order.state == 'new':
            if state == 'confirmed' or state == 'assembled' or state == 'sent':
                send_email('Ваш заказ подтвержден', 'Накладная во вложениях', [order.user.email], [order.order_pdf])

        # Изменение статуса
        order.state = state
        order.save()

        # Если заказ отменен, прибавляем к общему количеству товаров число товаров отмененного заказа
        if state == 'canceled':
            order_items = OrderItem.objects.filter(order=order)
            for order_item in order_items:
                product_info = order_item.product_info
                product_info.quantity += order_item.quantity
                product_info.save()
            # Проверка есть ли у магазина еще не завершенные заказы
            self.change_status_if_all_orders_finished(order.shop)

        # Если заказ доставлен, то проверяем есть ли у магазина еще не завершенные заказы
        elif state == 'delivered':
            self.change_status_if_all_orders_finished(order.shop)

        return JsonResponse({'Status': True})

    # Меняет статус магазина если все заказы завершены
    def change_status_if_all_orders_finished(self, shop):
        not_finished_orders = Order.objects.filter(shop=shop).exclude(state='delivered').exclude(state='canceled')
        if not not_finished_orders:
            shop.state = True
            shop.save()