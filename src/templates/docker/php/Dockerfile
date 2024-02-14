# Use Apache PHP as base image
FROM php:8.2-apache

# Install Zip, Unzip and Git (required by Composer)
Run apt-get update && apt-get install -y zip
Run apt-get update && apt-get install -y unzip
Run apt-get update && apt-get install -y git
 
# Install Composer (as a package manager)
RUN curl -sS https://getcomposer.org/installer \
  | php -- --install-dir=/usr/local/bin --filename=composer

# Install MySQLi (for MySQL support)
RUN docker-php-ext-install mysqli

# Install PDO MySQL (for the PHP CRUD API)
RUN docker-php-ext-install pdo
RUN docker-php-ext-install pdo_mysql