# Dockerfile Frontend -- author_email: mory.bamba@mehriso.com
FROM node:16.13.1 as build-stage

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build-only

FROM httpd:2.4
COPY httpd.conf /usr/local/apache2/conf/httpd.conf
COPY --from=build-stage /app/dist/ /usr/local/apache2/htdocs/
COPY .htaccess /usr/local/apache2/htdocs/.htaccess

EXPOSE 80
