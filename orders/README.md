# Порядок запуска

## Запуск бэкенда

1. Установка пакетов
   `pipenv install`
2. Переход в папку с проектом
   `cd orders`
3. Создание миграций
   `python manage.py migrate`
4. Запуск сервера
   `python manage.py runserver`
5. Запуск Celery для асинхронных задач
   `celery -A orders worker -l info`

## Запуск фронтенда (React)

1. Переход в папку с форнтендом
   `cd orders/frontend`
2. Установка зависимостей
   `npm install`
3. Запуск
   `npm start`

# Postman collection
https://documenter.getpostman.com/view/8571751/SWEB1FbC
