# ============================================================
# STAGE 1: Build
# Uses Node.js to install dependencies and build the Vite app.
# Produces a /app/dist folder with static HTML/CSS/JS files.
# ============================================================
FROM node:22-alpine AS build
WORKDIR /app

# Copy package files first for layer caching.
# If package.json and package-lock.json haven't changed,
# Docker reuses the cached 'npm ci' layer (much faster rebuilds).
COPY package.json package-lock.json ./

# 'npm ci' is preferred over 'npm install' in CI/Docker:
# - Installs exact versions from package-lock.json
# - Fails if lock file is out of sync
# - Faster and more reliable
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the Vite app for production
# Output goes to /app/dist
RUN npm run build

# ============================================================
# STAGE 2: Serve
# Uses Nginx (tiny ~25MB image) to serve the static files.
# No Node.js needed at runtime - just a web server.
# ============================================================
FROM nginx:alpine AS runtime

# Remove the default Nginx config and replace with ours
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx config (handles SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Nginx runs in the foreground so Docker can track the process
CMD ["nginx", "-g", "daemon off;"]
