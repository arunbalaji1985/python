from django.db import models
import uuid

# Create your models here.

class MultiValuedField(models.TextField):
    pass

class MailTemplateModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=50)
    subject = models.CharField(max_length=512, default='Subject placeholder')
    recipients = models.TextField()
    body = models.TextField()