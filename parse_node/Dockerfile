FROM node:latest

ENV PARSE_HOME /parse-server

WORKDIR $PARSE_HOME
COPY . .

RUN yarn

EXPOSE 1337

CMD ["yarn", "start"]