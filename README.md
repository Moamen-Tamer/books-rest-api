# Books REST API 

A simple, file-based REST API for managing a collection of books. Built with Node.js and TypeScript using only core modules (no Express!).

## What I Built

This was a weekend challenge to create a REST API from scratch without using any frameworks. The goal was to understand how HTTP servers actually work under the hood.

The API lets you manage a book collection with full CRUD operations, plus some extra search features I added for fun.

## Features

- **CRUD Operations**: Create, Read, Update, Delete books
- **Multiple Search Options**: Find books by ID, name, author, genre, or year
- **JSON Storage**: All data persists to a simple JSON file
- **Error Handling**: Custom error classes and proper HTTP status codes
- **TypeScript**: Fully typed with strict mode enabled

## Tech Stack

- **Node.js** - Runtime environment
- **TypeScript** - For type safety
- **Core Modules Only** - No Express, no external libraries

## Project Structure
```
├── data/
│   └── books.json         # Data storage
├── src/
|   ├── bookHandler.ts     # All book operations
│   ├── routes.ts          # Routes
│   ├── server.ts          # Main server entry point
│   └── types.ts           # Types and utilities
├── LICENSE
├── README.md
└── tsconfig.json          # TypeScript config
```

## API Endpoints

### Books

| Method |           Endpoint          |         Description        |
|--------|-----------------------------|----------------------------|
|  GET   |        `/books/get`         | Get all books              |
|  GET   |     `/books/get/id/:id`     | Get a specific book by ID  |
|  GET   |   `/books/get/name/:name`   | Get a book by name         |
|  GET   | `/books/get/author/:author` | Get all books by an author |
|  GET   |  `/books/get/genre/:genre`  | Get all books in a genre   |
|  GET   |   `/books/get/year/:year`   | Get all books from a year  |
|  POST  |        `/books/add`         | Add a new book             |
|  PUT   |     `/books/update/:id`     | Update a book              |
| DELETE |     `/books/delete/:id`     | Delete a book              |

### Example Requests

**Get all books:**
```bash
curl http://localhost:3000/books/get
```

**Add a new book:**
```bash
curl -X POST http://localhost:3000/books/add \
  -H "Content-Type: application/json" \
  -d '{"name":"1984","author":"george orwell","genre":"science fiction","year":1949}'
```

**Update a book:**
```bash
curl -X PUT http://localhost:3000/books/update/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"updated name","author":"updated author","genre":"philosophy","year":2020}'
```

**Delete a book:**
```bash
curl -X DELETE http://localhost:3000/books/delete/1
```

## Available Genres

- mystery
- philosophy
- science fiction
- psychological thrillers
- personal development

## Challenges I Faced

1. **Async events** - Figuring out `req.on('data')` and `req.on('end')` was tricky
2. **URL encoding** - Spaces in names needed special handling
3. **File paths** - TypeScript's compiled output changed where files were located
4. **No frameworks** - Everything had to be done manually (routing, parsing, etc.)

## Future Improvements

- [ ] Add unit tests (Jest)
- [ ] Add input validation for POST/PUT
- [ ] Switch to a real database

## License

MIT - Feel free to use this however you want!

## Acknowledgments

Built as part of a weekend coding challenge to practice backend fundamentals.
