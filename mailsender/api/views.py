from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets, serializers, validators
from . import models
from django.core.mail import send_mail, get_connection, EmailMessage
from django.views.decorators.csrf import csrf_exempt

import re

# Create your views here.

class RecipientStringValidator:
    EMAIL_REGEX = re.compile('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}')
    def validate(self, value):
        recipients = value.strip().split(",;")
        for r in recipients:
            if not self.EMAIL_REGEX.match(r):
                message = f"{r} is not a valid email address"
                raise serializers.ValidationError(message)

class MailTemplateSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = models.MailTemplateModel
        fields = ['id', 'name', 'subject', 'recipients', 'body']

    def validate(self, attrs):
        if 'recipients' in attrs:
            RecipientStringValidator().validate(attrs['recipients'])
        return super().validate(attrs)

class MailTemplateViewSet(viewsets.ModelViewSet):
    serializer_class = MailTemplateSerializer

    def get_queryset(self):
        return models.MailTemplateModel.objects.all()

@csrf_exempt
def sendmail(request):
    if request.method == 'POST':
        with get_connection(host='localhost',
                            port=2525,
                            use_tls=False) as conn:
            EmailMessage(
                request.POST['subject'],
                request.POST['body'],
                from_email='noreply@example.com',
                to=request.POST['recipients'].split(","),
                connection=conn
            ).send()

    return JsonResponse(data={}, status=200)