FROM nginx:latest
COPY . /usr/share/nginx/html
COPY default.conf /etc/ngnx/config/default.conf