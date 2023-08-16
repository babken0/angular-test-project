FROM node:18.12.1 as build
RUN mkdir -p /app

WORKDIR /app

COPY package.json /app/
RUN npm install


COPY . /app/
RUN npm run build --prod

FROM nginx:alpine
COPY --from=build app/dist/angular-project usr/share/nginx/html

