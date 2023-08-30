FROM python:3

WORKDIR /app/backend

RUN pip install kafka-python aiohttp==3.8.4 asgiref==3.7.2 autobahn[asyncio,encryption,serialization,xbr]

COPY . .

CMD ["python", "test_consumer.py"]
