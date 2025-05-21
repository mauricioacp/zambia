FROM node:lts-slim as build
WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --ignore-scripts

RUN npm install --no-save cross-env

COPY . .

ARG NODE_ENV=production
ARG API_URL
ARG API_PUBLIC_KEY
ARG PROD=true

ENV NODE_ENV=${NODE_ENV}
ENV API_URL=${API_URL}
ENV API_PUBLIC_KEY=${API_PUBLIC_KEY}
ENV PROD=${PROD}

RUN npm run config
RUN npx nx build zambia --configuration=production

FROM nginx:stable AS final
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/dist/apps/zambia/browser/ .

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
