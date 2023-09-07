from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework import serializers, validators
from kafka import KafkaProducer
from django.db.models import functions

from . import models

import datetime
import json
import pytz
import os

KAFKA_HOST = os.environ.get('KAFKA_HOST', '127.0.0.1')
KAFKA_PORT = os.environ.get('KAFKA_PORT', 9092)

class HostDataSerializer(serializers.ModelSerializer):
    __kafka_producer = None

    @property
    def kafka_producer(self):
        if self.__kafka_producer is None:
            self.__kafka_producer = KafkaProducer(bootstrap_servers=f"{KAFKA_HOST}:{KAFKA_PORT}", value_serializer=lambda m: m.toJSON().encode('utf-8'))
        return self.__kafka_producer

    class Meta:
        # Serialize all fields of HostData
        model = models.HostData
        fields = '__all__'
        extra_kwargs = {
            'ip': {
                # Turn off unique constraint validator, which is invoked before create(), and,
                # fails the POST call that updates an existing record.
                'validators': []
            }
        }

    def create(self, validated_data):
        """
        Overridden implementation to handle upsert with POST call.
        Update host data, using the IP as unique identifier.
        """
        row = validated_data | {'ts': datetime.datetime.now(pytz.utc)}
        res, created = models.HostData.objects.update_or_create(ip=validated_data['ip'], defaults=row)
        # If created/updated, send a message to kafka topic
        if res:
            self.kafka_producer.send('host_data', res)
        return res

class HostDataViewSet(ModelViewSet):
    serializer_class = HostDataSerializer
    queryset = models.HostData.objects.all()

