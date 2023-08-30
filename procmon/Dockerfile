FROM python:3

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app/backend

RUN pip install kafka-python aiohttp==3.8.4 asgiref==3.7.2 autobahn[asyncio,encryption,serialization,xbr] Django==4.2.3 djangorestframework==3.14.0 psutil==5.9.5 Requests==2.31.0 \
    django-cors-headers

COPY ./ .
