# Add PHP Backend

Add [PHP](https://www.php.net/), [Composer](https://getcomposer.org/), [MySQL](https://mariadb.org/), [phpMyAdmin](https://www.phpmyadmin.net/) and [PHP CRUD API](https://github.com/mevdschee/php-crud-api) to your local development environment.

## Installation

1. Install [Docker](https://www.docker.com/) and [Node.js](https://nodejs.org/)

2. Create a new app project:

    ```bash
    npm create vite@latest
    ```

3. Add a PHP backend:

    ```bash
    npx add-php-backend
    ```

## Usage

- Run `npm run backend` to start the backend
- Open the PHP server at http://localhost:8000
- Open phpMyAdmin at http://localhost:8080
- Use the PHP CRUD API in frontend with `/api.php`

## How it works

## Support development

For all:

- Report bugs in the [issues list](https://github.com/scriptPilot/add-php-backend/issues)

For maintainer:

- Commit changes with an issue (closure) reference
- Run npm version patch | minor | major and push changes
- Let the workflow manage the release to GitHub and NPM
