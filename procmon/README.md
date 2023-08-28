# Real time host monitor

## An example implementation of realtime host monitor built in Python

## Technologies
 * Python
 * Django (for collecting metrics)
 * WAMP router (for real time messaging over websockets) -- crossbar.io
 * Kafka for communication + Zookeeper

## How it works
 * Starting Django app exposes HTTP endpoint to collect host metrics.
 * Agent running on host (localhost in this example) publishes host metrics via the endpoint.
 * The POST endpoint persits the data in sqlite3 (use only for development) DB and publishes the event to Kafka. The DB is used to handle back-pressure.
 * A Kafka consumer (api/management/commands/host_data_consumer.py) receives the event, queries the latest stats from the DB and publishes the stats over WAMP on a topic.
 * A WAMP consumer (home/templates/home/index.html) subscribes to the topic in the same WAMP realm and displays the latest stats in simple HTML list.

## Code organization
 * `api` : Serves API to accept host data
   * `api/management/commands` : django management command that stars the kafka consumer
 * `home` : Simple Home page (plain HTML)
 * `agent.py` : Standalone agent that collect simple host stats and publishes to the django server

## Pre-requisites
 * Download Kafka and Zookeeper binaries
 * Download crossbar
 * Install necessary Python packages
   * TODO: Update

## Steps to start
 1. Start Zookeeper + Kafka with default config
```
 $KAFKA_HOME/bin/zookeeper-server-start.sh $KAFKA_HOME/config/zookeeper.properties
 $KAFKA_HOME/bin/kafka-server-start.sh $KAFKA_HOME/config/server.properties
```
 2. Start crossbar WAMP router
```
 crossbar start
```
 3. Start django server
```
 cd procmon
 python3 manage.py migrate
 python3 manage.py runserver
```
 4. Start the kafka consumer
```
 python3 manage.py host_data_consumer
```
 5. Start the agent
```
 python3 ./agent.py
```

 * Hit http://127.0.0.1:8000/ and you should be able to see a simple page that displays the host stats updating in realtime

## TODO
 * Authentication
 * Dockerize

## References
 * crossbar.io