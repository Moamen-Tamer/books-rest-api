import type { ServerResponse } from 'http';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

export const paths = {
    booksJson: path.join(__dirname, '../data/books.json'),
    bookHandlers: path.join(__dirname, 'bookHandlers.ts'),
    prototypes: path.join(__dirname, 'prototypes.ts')
}

declare module 'http' {
    interface IncomingMessage {
        id: string | undefined;
        name: string | undefined;
        author: string | undefined;
        genre: string | undefined;
        year: string | undefined;
    }
}

export type Book = {
    id: number,
    name: string,
    author: string,
    genre: Genre,
    year: number
}

const genres = ['mystery', 'philosophy', 'science fiction', 'psychological thrillers', 'personal development'] as const;

type Genre = typeof genres[number];

export function isGenre (value: any): value is Genre {
    return genres.includes(value);
}

export class FileOperationError extends Error {
    constructor(operation: string, originalError: Error) {
        super(`failed to ${operation}: ${originalError}`);
        this.name = 'FileOperationError';
    }
}

export class invalidBookDataError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'invalidBookDataError';
    }
}

export function sendError(res: ServerResponse, code: number, message: string): void {
    res.writeHead(code, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: message }));
}