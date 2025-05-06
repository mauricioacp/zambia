FROM node:lts-slim as build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production --ignore-scripts || npm install --only=production --ignore-scripts

COPY . .

RUN npm install --include=dev
RUN npx nx build zambia --configuration=production

FROM nginx:stable AS final
WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=builder /app/dist/apps/zambia/browser/ .

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
