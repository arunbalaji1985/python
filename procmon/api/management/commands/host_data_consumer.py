import socket

import asyncio
import requests
import psutil
import json

from autobahn.asyncio.component import Component, run
from kafka import KafkaConsumer

from django.core.management.base import BaseCommand, CommandError
from api import models as api_models 
from asgiref.sync import sync_to_async

SERVER = '127.0.0.1'
component = Component(transports=f"ws://{SERVER}:8080/ws", realm='realm1')

@component.on_join
async def called_on_joined(session, details):
    print("Connected")

    kafka_consumer = KafkaConsumer('host_data')
    for message in kafka_consumer:
        stats = json.loads(bytes.decode(message.value))
        if 'ip' in stats:
            ip = stats['ip']
            # sync
            # obj = api_models.HostData.objects.get(ip=ip)
            # async
            obj = await sync_to_async(api_models.HostData.objects.get, thread_sensitive=True)(ip=ip)
            session.publish('host_data', obj.toJS())

class Command(BaseCommand):
    def handle(self, *args, **options):
        run([component])