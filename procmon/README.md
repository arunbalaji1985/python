# Real time host monitor

## An example implementation of realtime host monitor built in Python

## Technologies
 * Python
 * Django (for collecting metrics)
 * WAMP router (for real time messaging over websockets) -- crossbar.io
 * Kafka for communication + Zookeeper
 * ReactJS (for frontend)
 * Docker (for containers)

## How it works
 * Starting Django app exposes HTTP endpoint to collect host metrics.
 * Agent running on host (localhost in this example) publishes host metrics via the endpoint.
 * The POST endpoint persits the data in sqlite3 (use only for development) DB and publishes the event to Kafka. The DB is used to handle back-pressure.
 * A Kafka consumer (api/management/commands/host_data_consumer.py) receives the event, queries the latest stats from the DB and publishes the stats over WAMP on a topic.
 * A WAMP consumer (home/templates/home/index.html) subscribes to the topic in the same WAMP realm and displays the latest stats in simple HTML list.

## Code organization
 * `crossbar` : Crossbar router config
 * `api` : Serves API to accept host data
   * `api/management/commands` : django management command that stars the kafka consumer
 * `frontend` : ReactJS based frontend page
 * `agent.py` : Standalone agent that collect simple host stats and publishes to the django server
 * `management` : Standalone Django command to consume messages from Kafka queue

## Pre-requisites
### Without Docker
 * Download Kafka and Zookeeper binaries
 * Download crossbar
 * Install necessary Python packages
   `pip install -r requirements.txt`

### Dockerized setup (simple)
 * Install docker and docker-compose

## Steps to start
### Without Docker
 1. Start Zookeeper + Kafka with default config
```
 $KAFKA_HOME/bin/zookeeper-server-start.sh $KAFKA_HOME/config/zookeeper.properties
 $KAFKA_HOME/bin/kafka-server-start.sh $KAFKA_HOME/config/server.properties
```
 2. Start crossbar WAMP router
```
 cd crossbar
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
 6. Start the frontend
```
 cd frontend
 npm start
```

 * Hit http://127.0.0.1:3000/ and you should be able to see a simple page that displays the host stats updating in realtime

### Dockerized setup (simple)
 1. Start the docker services
```
  docker-compose build
  docker-compose up
```
   * This will start the following components and servers in their respective containers
     * crossbar router
     * zookeeper
     * kafka
     * django backend server
     * react frontend server
     * (optional) test backend consumer

 2. Start the kafka queue consumer in the `backend` container. This will listen to `host_data` Kafka topic and publish the stats to the front-end over websockets
```
  env KAFKA_HOST=kafka docker-compose exec backend python3 manage.py host_data_consumer
```
 3. Start the host agent
```
  cd procmon
  python3 agent.py
```

## TODO
 * Authentication

## References
 * crossbar.io
