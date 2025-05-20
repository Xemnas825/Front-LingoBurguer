FROM nginx:latest
COPY . /usr/share/nginx/html
COPY Fronted/html/default.conf /etc/ngnx/config/default.conf
EXPOSE 80
