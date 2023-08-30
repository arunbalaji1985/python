FROM crossbario/crossbar

WORKDIR /app/router

USER root

COPY .crossbar ./.crossbar

RUN chown -R crossbar:crossbar /app/router

ENTRYPOINT ["crossbar", "start"]


