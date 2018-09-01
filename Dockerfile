FROM node:10.9-alpine
MAINTAINER Takuma Hashimoto <takumaxd@gmail.com>

ARG foursquare_client_id
ARG base_url

ENV FOURSQUARE_CLIENT_ID=$foursquare_client_id
ENV BASE_URL=$base_url
ENV HOST 0.0.0.0

RUN addgroup -S app && adduser -h /var/app -S -G app app \
  && echo "app ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers \
  && echo 'app:app' | chpasswd
USER app

COPY --chown=app:app . /var/app/4sweep-next

WORKDIR /var/app/4sweep-next

RUN npm install && npm run build

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start"]
