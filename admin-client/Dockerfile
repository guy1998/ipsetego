# ---- Build ----
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Vite inlines VITE_* variables at build time, so this has to be a build arg,
# not a runtime env var.
ARG VITE_BACKEND_URL=http://localhost:1989
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
RUN npm run build

# ---- Serve ----
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
