# Add PHP Backend

Add PHP, Composer, MySQL and PHP CRUD API to your local development environment.

## Installation

1. Install Docker and Node.js

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
- Open the PHP Server at http://localhost:8000
- Open phpMyAdmin at http://localhost:8080
- Use the PHP CRUD api with `/api.php`

## Development (this repository)

- Commit changes with an issue (closure) reference
- Run `npm version patch | minor | major` and push changes
- Let the workflow manage the release to GitHub and NPM
