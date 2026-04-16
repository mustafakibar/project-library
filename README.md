# FCC Quality Assurance — Personal Library

Express + MongoDB REST API for managing books and their comments, built for the FreeCodeCamp Quality Assurance certification.

## Features

- `POST /api/books` — adds a new book by title; returns `{ _id, title }`
- `GET /api/books` — lists all books with `_id`, `title`, and `commentcount`
- `GET /api/books/:id` — retrieves a single book with its full comments array
- `POST /api/books/:id` — appends a comment to a book
- `DELETE /api/books` — deletes all books from the database
- `DELETE /api/books/:id` — deletes a single book by id
- Functional tests cover all CRUD paths and error conditions

## Tech Stack

- Node.js
- Express
- MongoDB / Mongoose
- Chai / Mocha

## Requirements

- Node.js 16+
- MongoDB 4+
- Yarn 1.x or npm 8+

## Installation

```bash
yarn install
```

## Environment Variables

Derived from `.env`:

- `PORT` — server port (defaults to `3000`)
- `NODE_ENV` — `development` | `test` | `production`
- `DB_CONNECTION_URI` — MongoDB connection string

## Usage

```bash
yarn start
```

Server listens on `http://localhost:3000`.

## Testing

```bash
NODE_ENV=test yarn start
```

## API

- `GET /api/books` — list all books
- `POST /api/books` — add a book
- `DELETE /api/books` — delete all books
- `GET /api/books/:id` — get one book with comments
- `POST /api/books/:id` — add a comment to a book
- `DELETE /api/books/:id` — delete a book

## Project Structure

```
.
├── routes/
├── tests/
├── public/
├── views/
├── db.js
├── server.js
└── package.json
```

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file.
