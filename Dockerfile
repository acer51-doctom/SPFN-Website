# Use the official Nginx image
FROM nginx:alpine

# Copy your HTML files to Nginx's default directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Nginx starts automatically by default in the base image
