# Dockerfile Backend -- author_email: mory.bamba@mehriso.com
FROM node:16.13.1

# Define how verbose should npm install be
ARG NPM_LOG_LEVEL=silent

# Hide Open Collective message from install logs
ENV OPENCOLLECTIVE_HIDE=1

# Hiden NPM security message from install logs
ENV NPM_CONFIG_AUDIT=false

# Hide NPM funding message from install logs
ENV NPM_CONFIG_FUND=false


WORKDIR /app

COPY package.json ./

COPY package-lock.json ./

COPY schema.prisma ./prisma/

COPY . .

RUN npm install

RUN npm run prebuild

RUN npx @nestjs/cli build

EXPOSE 3008

CMD [ "node", "dist/src/main"]
