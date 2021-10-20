FROM node:17-alpine
WORKDIR /usr/src/app
RUN apk add --no-cache openjdk8-jre
RUN npm config set unsafe-perm true
RUN npm i -g firebase-tools && firebase setup:emulators:firestore