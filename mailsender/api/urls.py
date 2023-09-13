from rest_framework import routers 
from . import views
from django.urls import path, include

router = routers.SimpleRouter()

router.register(r'mails', views.MailTemplateViewSet, basename='mails')

urlpatterns = router.urls + [
    path('sendmail', views.sendmail)
]
