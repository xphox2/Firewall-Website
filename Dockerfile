FROM nginx:alpine

# Optional: pass a specific build id (e.g. git short SHA) via --build-arg BUILD_ID=…
# When omitted, a fresh timestamp is generated at build time.
ARG BUILD_ID=

# Default asset cache policy for the production image. The website-dev service
# overrides this to "no-cache" (see docker-compose.yml) so bind-mounted edits
# show up without a forced refresh.
ENV ASSET_CACHE_CONTROL="public, max-age=31536000, immutable"

# Cache policy config — Nginx substitutes ${ASSET_CACHE_CONTROL} at startup
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy static website assets to the default Nginx html serving directory
COPY . /usr/share/nginx/html

# Global cache-busting: stamp ONE fresh token onto every versioned asset URL
# (?v=… on CSS, JS, images, video) so each image build invalidates browser
# caches for all of them at once — no per-file version bumping required.
RUN set -e; \
    BID="${BUILD_ID:-$(date +%Y%m%d%H%M%S)}"; \
    for f in index.html docs.html; do \
        [ -f "/usr/share/nginx/html/$f" ] && \
        sed -i -E "s/\?v=[0-9A-Za-z._-]+/?v=${BID}/g" "/usr/share/nginx/html/$f"; \
    done; \
    rm -f /usr/share/nginx/html/nginx.conf.template; \
    echo "cache-bust: stamped all ?v= assets with build id ${BID}"

# Expose port 80 inside the container
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
