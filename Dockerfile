############ BUILD STAGE ###############
FROM node:14.8.0-alpine as build

WORKDIR /home/node/samaa

# Install deps
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install --production

# Build app
COPY --chown=node:node . .
RUN npm run-script build
RUN npm upgrade caniuse-lite browserslist


############# RUN-TIME ################
FROM nginx:1.16-alpine
WORKDIR /opt/hurracloud/samaa
COPY --from=build /home/node/samaa/build .
COPY nginx.conf /etc/nginx/nginx.conf
