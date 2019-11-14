from django.urls import path
from backend.views import UserView, LogIn, AccountInfo, SendConfirmCode, ConfirmEmail, AccountContacts, \
    CategoryView, ProductView, PartnerView, PartnerInfo, ParthnerProducts, UserCart, OrderView

urlpatterns = [
    path('registration/', UserView.as_view()),
    path('sendToken/', SendConfirmCode.as_view()),
    path('confirmation/', ConfirmEmail.as_view()),
    path('login/', LogIn.as_view()),
    path('info/', AccountInfo.as_view()),
    path('contact/', AccountContacts.as_view()),
    path('categories/', CategoryView.as_view()),
    path('products/', ProductView.as_view()),
    path('partner/', PartnerView.as_view()),
    path('partner_info/', PartnerInfo.as_view()),
    path('partner_products/', ParthnerProducts.as_view()),
    path('cart/', UserCart.as_view()),
    path('order/', OrderView.as_view()),
]