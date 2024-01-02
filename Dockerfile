FROM httpd:latest
COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf
COPY ./build /usr/local/apache2/htdocs/
COPY ./.htaccess /usr/local/apache2/htdocs/
EXPOSE 80