# 4sweep-next

## Prerequisites

You can install Node.js which needs to this application via [ndenv](https://github.com/riywo/ndenv).

```bash
$ ndenv install
```

Set the following environment variable in `~/.bash_profile`, `~/.zshenv` or etc.

- `FOURSQUARE_CLIENT_ID`: Your OAuth client ID (issues from <https://foursquare.com/developers/apps>). 

## Launch application

```bash
$ npm run dev  # development mode
$ npm run build && npm run start  # production mode
```

## Deployment

### Heroku

```bash
$ heroku login
$ heroku container:login
$ heroku create
$ heroku container:push web --arg base_url=${YOUR_HEROKU_APP_URL},foursquare_client_id=${FOURSQUARE_CLIENT_ID}
$ heroku container:release web
$ heroku open
```

For details, see https://nuxtjs.org/faq/heroku-deployment/ and https://devcenter.heroku.com/articles/container-registry-and-runtime

### Build and push Docker image to a repository

```bash
$ export BASE_URL=${APP_URL}
$ make build
$ export REPO_URI=${DOCKER_REPOSITORY_URI}
$ make push
```

## License

Copyright (C) 2018 Takuma Hashimoto

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
