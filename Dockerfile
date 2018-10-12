FROM node:8.12.0-alpine

LABEL maintainer="Rajitha Kumara <tmrkumara@gmail.com>"

COPY . /app

RUN cd app; npm install

COPY build/docker/start.sh /app

CMD /app/start.sh
