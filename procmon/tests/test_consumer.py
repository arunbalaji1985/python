from kafka import KafkaConsumer
import os
import time
from autobahn.asyncio.component import Component, run

KAFKA_HOST = os.environ.get('KAFKA_HOST', '127.0.0.1')
KAFKA_PORT = os.environ.get('KAFKA_PORT', 9092)

print(KAFKA_HOST, KAFKA_PORT)

kafka_consumer = KafkaConsumer('host_data', bootstrap_servers=(KAFKA_HOST + ":" + KAFKA_PORT))

SERVER = os.environ.get('API_SERVER', '127.0.0.1')
component = Component(transports=f"ws://{SERVER}:8082/ws", realm='realm1')

for message in kafka_consumer:
    print(bytes.decode(message.value))
