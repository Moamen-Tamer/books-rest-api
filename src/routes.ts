export const routes = {
    centralPage: (url: string) => url === '/',
    getAllBooks: (url: string) => url === '/books/get' || url === '/books/get/',
    getOneBookById: (url: string) => url.match(/^\/books\/get\/id\/(\d+)\/?$/),
    getOneBookByName: (url: string) => url.match(/^\/books\/get\/name\/([^/]+)\/?$/),
    getBooksByAuthor: (url: string) => url.match(/^\/books\/get\/author\/([^/]+)\/?$/),
    getBooksByGenre: (url: string) => url.match(/^\/books\/get\/genre\/([^/]+)\/?$/),
    getBooksByYear: (url: string) => url.match(/^\/books\/get\/year\/(\d{1,4})\/?$/),
    updateBook: (url: string) => url.match(/^\/books\/update\/(\d+)\/?$/),
    addBook: (url: string) => url === '/books/add' || url === '/books/add/',
    deleteBook: (url: string) => url.match(/^\/books\/delete\/(\d+)\/?$/)
}