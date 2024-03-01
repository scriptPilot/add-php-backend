# Add PHP Backend

Add [PHP](https://www.php.net/), [Composer](https://getcomposer.org/), [MySQL](https://mariadb.org/), [phpMyAdmin](https://www.phpmyadmin.net/) and [PHP CRUD API](https://github.com/mevdschee/php-crud-api) to your local development environment.

You might be interested in a simple [Synchronization between local IndexedDB and MySQL Database](https://github.com/scriptPilot/dexie-mysql-sync).

## Installation

1. Install [Docker](https://www.docker.com/) and [Node.js](https://nodejs.org/)

2. Create a new app project:

    ```bash
    npm create vite
    ```

3. Add a PHP backend:

    ```bash
    npx add-php-backend
    ```

## Usage

- Run `npm run backend` to start the backend
- Open the PHP server at http://localhost:8000
- Open phpMyAdmin at http://localhost:8080
  - Login with username `root` and password `root`
- Use the PHP CRUD API in frontend with `/api.php`

## How it works

- **no dependency** will be added to the repository
- you have **full control** of all source files for fine tuning
- running `npx add-php-backend` will download the package in a cache folder
- the package main script will **create some files** in the project folder if not exist:
  - `docker/` folder with the Dockerfiles
  - `public/api.php` initialization of the PHP CRUD API
  - `public/credentials.template.php` to be renamed to `credentials.php` for production
  - `composer.json` to configure Composer
  - `docker-composer.yml` to configure the container setup
  - `schema.sql` contains the database schema and updates to it
  - `testdata.sql` contains test data only for development
- the package main script will **modify some files** in your project folder:
  - add a `backend` script to the `package.json` file and prepend it to `dev`
  - add a proxy server config for PHP files to the Vite config file 
  - add `vendor/` and `credentials.php` to the `.gitignore` file

## Support

Report bugs in the [issues list](https://github.com/scriptPilot/add-php-backend/issues).

## Maintainer

1. Apply changes
2. Run `npm run demo` to build and start the `demo-app`
3. Commit changes with an issue (closure) reference
4. Run `npm version patch | minor | major` and push changes
5. Let the workflow manage the release to GitHub and NPM

## Maintainer

1. Apply changes to the code
2. Run `npm run demo` to build and start the `demo-app`
3. Apply changes to the `README.md` file and screenshots
4. Commit changes with an issue (closure) reference
5. Run `npm version patch | minor | major` and push changes
6. Let the workflow manage the release to GitHub and NPM
