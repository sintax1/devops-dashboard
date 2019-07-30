FROM node

RUN apt-get update && apt-get install -y vim

RUN npm install -g gulp

RUN npm install -g bower

USER node

EXPOSE 8080

COPY ./entry-point.sh /

ENTRYPOINT ["/entry-point.sh"]
