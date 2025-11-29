import * as http from 'http';
import { routes } from './routes.js';
import { getOneBookById,
         getOneBookByName,
         getBooksByAuthor,
         getBooksByGenre,
         getBooksByYear,
         getAllBooks,
         updateBook,
         deleteBook,
         addBook
} from './bookHandler.js';

const server = http.createServer( async (req, res) => {
    const { method, url } = req;

    console.log(`${method}: ${url}`);

    if (!url) return;

    let route;

    if (routes.centralPage(url)) {
        
        res.writeHead(200, { 'content-type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Central Page</title>
                </head>
                <body>
                    <p>try our APIs:</p>
                    <hr>
                    <p>"http://localhost:3000/"</p>
                    <p>"http://localhost:3000/books/get"</p>
                    <p>"http://localhost:3000/books/get/id/4"</p>
                    <p>"http://localhost:3000/books/get/name/Harry-Potter"</p>
                    <p>"http://localhost:3000/books/get/author/Agatha-Christie"</p>
                    <p>"http://localhost:3000/books/get/genre/science-fiction"</p>
                    <p>"http://localhost:3000/books/get/year/2021"</p>
                    <p>"http://localhost:3000/books/update/2"</p>
                    <p>"http://localhost:3000/books/add"</p>
                    <p>"http://localhost:3000/books/delete/3"</p>
                </body>
            </html>
        `);

    } else if (method === 'GET' && routes.getAllBooks(url)) {
        await getAllBooks(req, res);
    } else if (method === 'GET' && (route = routes.getOneBookById(url))) {
        req.id = decodeURIComponent(route[1]!);
        await getOneBookById(req, res);
    } else if (method === 'GET' && (route = routes.getOneBookByName(url))) {
        req.name = decodeURIComponent(route[1]!);
        await getOneBookByName(req, res);
    } else if (method === 'GET' && (route = routes.getBooksByAuthor(url))) {
        req.author = decodeURIComponent(route[1]!);
        await getBooksByAuthor(req, res);
    } else if (method === 'GET' && (route = routes.getBooksByGenre(url))) {
        req.genre = decodeURIComponent(route[1]!);
        await getBooksByGenre(req, res);
    } else if (method === 'GET' && (route = routes.getBooksByYear(url))) {
        req.year = decodeURIComponent(route[1]!);
        await getBooksByYear(req, res);
    } else if (method === 'PUT' && (route = routes.updateBook(url))) {
        req.id = decodeURIComponent(route[1]!);
        await updateBook(req, res);
    } else if (method === 'POST' && (route = routes.addBook(url))) {
        await addBook(req, res);
    } else if (method === 'DELETE' && (route = routes.deleteBook(url))) {
        req.id = decodeURIComponent(route[1]!);
        await deleteBook(req, res);
    } else {
        res.writeHead(405, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: 'incorrect method or route' }));
    }

});

server.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
});