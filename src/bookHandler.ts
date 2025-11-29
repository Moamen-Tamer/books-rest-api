import * as fs from 'fs/promises';
import { IncomingMessage, ServerResponse } from 'http';
import type { Book } from './types.js';
import { paths,
         isGenre,
         sendError,
         FileOperationError,
         invalidBookDataError
} from './types.js';

export async function fetchBooks(): Promise<Book[]> {
    const fileContent: string = await fs.readFile(paths.booksJson, 'utf-8');
        
    return JSON.parse(fileContent);
}

export async function saveBooks(books: Book[]): Promise<void> {
    await fs.writeFile(paths.booksJson, JSON.stringify(books, null, 2), 'utf-8');
}

export async function getAllBooks(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
        const books: Book[] = await fetchBooks();

        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(books));
    } catch (error) {
        sendError(res, 500, 'internal server error');
    }
}

export async function getOneBookById(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
        const id: number = Number(req.id);

        if (Number.isNaN(id)) {
            res.writeHead(400, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ error: 'invalid id' }));
            return;
        }

        const allBooks: Book[] = await fetchBooks();

        if (!Array.isArray(allBooks)) throw new FileOperationError('fetch books', new Error('Books file is not an array'));

        const book: Book | undefined = allBooks.find((b: Book) => b.id === id);

        if (!book) throw new invalidBookDataError('invalid id');

        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(book));
    } catch (error) {
        sendError(res, 500, 'internal server error');
    }
}

export async function getOneBookByName(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
        const name: string = req.name!;

        if (typeof name !== 'string') {
            res.writeHead(400, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ error: 'invalid book name' }));
            return;
        }

        const allBooks: Book[] = await fetchBooks();

        if (!Array.isArray(allBooks)) throw new FileOperationError('fetch books', new Error('Books file is not an array'));

        const book: Book | undefined = allBooks.find((b: Book) => b.name.toLowerCase() === name.toLowerCase());

        if (!book) throw new invalidBookDataError('invalid book name');

        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(book));
    } catch (error) {
        sendError(res, 500, 'internal server error');
    }
}

export async function getBooksByAuthor(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
        const author: string = req.author!;

        if (typeof author !== 'string') {
            res.writeHead(400, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ error: 'invalid author name' }))
            return
        }

        const allBooks: Book[] = await fetchBooks();

        if (!Array.isArray(allBooks)) throw new FileOperationError('fetch books', new Error('Books file is not an array'));

        const chosenBooks: Book[] = allBooks.filter((b: Book) => b.author.toLowerCase() === author.toLowerCase());

        if (chosenBooks.length === 0) throw new invalidBookDataError('invalid author name');

        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(chosenBooks));
    } catch (error) {
        sendError(res, 500, 'internal server error');
    }
}

export async function getBooksByGenre(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
        const genre: string = req.genre!;

        if (!isGenre(genre)) {
            res.writeHead(400, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ error: 'invalid genre' }))
            return
        }

        const allBooks: Book[] = await fetchBooks();

        if (!Array.isArray(allBooks)) throw new FileOperationError('fetch books', new Error('Books file is not an array'));
        
        const chosenBooks: Book[] = allBooks.filter((b: Book) => b.genre.toLowerCase() === genre.toLowerCase());

        if (chosenBooks.length === 0) throw new invalidBookDataError('invalid genre');

        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(chosenBooks));
    } catch (error) {
        sendError(res, 500, 'internal server error');
    }
}

export async function getBooksByYear(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
        const year: number = Number(req.year);
        const currentYear = new Date().getFullYear();

        if (Number.isNaN(year) || year > currentYear) {
            res.writeHead(400, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ error: 'invalid year' }))
            return
        }

        const allBooks: Book[] = await fetchBooks();

        if (!Array.isArray(allBooks)) throw new FileOperationError('fetch books', new Error('Books file is not an array'));
        
        const chosenBooks: Book[] = allBooks.filter((b: Book) => b.year === year);

        if (chosenBooks.length === 0) throw new invalidBookDataError('invalid year');

        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(chosenBooks));
    } catch (error) {
        sendError(res, 500, 'internal server error');
    }
}

export async function addBook(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
        let bookData: string = '';

        req.on('data', (chunk: any) => {
            bookData += chunk.toString();
        });

        req.on('end', async () => {
            try {
                let books: Book[] = await fetchBooks();
                
                const newBook = JSON.parse(bookData);
                
                newBook.name = newBook.name.toLowerCase();
                newBook.author = newBook.author.toLowerCase();
                newBook.genre = newBook.genre.toLowerCase();

                const newId: number = books.length > 0 ? Math.max(...books.map((b: Book) => b.id)) + 1 : 1;
                newBook.id = newId;

                books.push(newBook);

                await saveBooks(books);

                res.writeHead(201, { 'content-type': 'application/json' });
                res.end(JSON.stringify(newBook));
            } catch (innerError) {
                sendError(res, 500, 'could not save the book');
            }
        });
    } catch (error) {
        sendError(res, 500, 'could not save the book');
    }
}

export async function updateBook(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
        const id: number = Number(req.id);
        
        let bookData: string = '';

        req.on('data', (chunk: any) => {
            bookData += chunk.toString();
        });

        req.on('end', async () => {
            const updatedBook: any = JSON.parse(bookData);
            updatedBook.name = updatedBook.name.toLowerCase();
            updatedBook.author = updatedBook.author.toLowerCase();
            updatedBook.genre = updatedBook.genre.toLowerCase();

            let books: Book[] = await fetchBooks();

            const index: number = books.findIndex((b: Book) => b.id === id);

            if (index < 0) throw new FileOperationError('fetch a book', new Error(`book of id: ${id} probably doesn't exist`));

            books[index] = {...books[index], ...updatedBook, id};

            await saveBooks(books);

            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(books[index]));
        });
    } catch (error) {
        sendError(res, 500, 'could not update the book');
    }
}

export async function deleteBook(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
        const id: number = Number(req.id);

        if (Number.isNaN(id)) {
            res.writeHead(400, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ error: 'invalid id' }));
            return;
        }

        let books: Book[] = await fetchBooks();

        if (books.every((b: any) => b.id !== id)) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Book not found' }));
            return;
        }

        books = books.filter((b: Book) => b.id !== id);

        await saveBooks(books);

        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ message: 'book deleted' }));

    } catch (error) {
        sendError(res, 500, 'could not delete the book');
    }
}