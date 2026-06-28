FROM nginx:alpine

# Copy static website assets to the default Nginx html serving directory
COPY . /usr/share/nginx/html

# Expose port 80 inside the container
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
