const id = require('id');

const customResourceResponse = require('constant')

class BookService{
    constructor(bookRepo){
        this.bookRepo = bookRepo;
    }

    async addBook(req){
        const{ title } = req.body;
        const{ author } = req.body;
        const { year } = req.body;
        const {v4: uuidv4 } = require("uuid");

        const response = {};

        if(!title || !author || !year){
            response.message = customResourceResponse.reqValidationError.message;
            response.statusCode = customResourceResponse.reqValidationError.statusCode;
            return response;
        }

        const book = await this.bookRepo.addBook(id, title, author, year);

        if(!book){
            response.message = customResourceResponse.serverError.message;
            response.statusCode = customResourceResponse.serverError.statusCode;
            return response;
        }

        response.message = customResourceResponse.reqCreated.message;
        response.statusCode = customResourceResponse.reqCreated.statusCode;
        response.data = book;

        return response;
    }

    async getAllBooks(){
        const response = {};
        const books = await bookRepo.getAllBooks();

        if(!books){
            response.message = customResourceResponse.recordNotFound.message;
            response.statusCode = customResourceResponse.recordNotFound.statusCode;
            return response;
        }
        response.message = customResourceResponse.success.message;
        response.statusCode = customResourceResponse.success.statusCode;
        response.data = books;

        return response;
    }

    async getBookById(req){
        const response = {};
        const { id } = req.params;

        const book = await this.bookRepo.getBookById(id);
        if(!book){
            response.message = customResourceResponse.recordNotFound.message;
            response.statusCode = customResourceResponse.recordNotFound.statusCode;
            return response;
          }

        response.message = customResourceResponse.success.message;
        response.statusCode = customResourceResponse.success.statusCode;
        response.data = books;

        return response;
    }

    async updateBookById(req) {
        const { title } = req.body;
        const { author } = req.body;
        const { year } = req.body;
    
        const response = {};
        const { id } = req.params;
    
        const updatedBook = await this.bookRepo.updateBookById(id, title, author, year);
        if (!updatedBook) {
          response.message = customResourceResponse.recordNotFound.message;
          response.statusCode = customResourceResponse.recordNotFound.statusCode;
          return response;
        }
    
        response.message = customResourceResponse.success.message;
        response.statusCode = customResourceResponse.success.statusCode;
        response.data = updatedBook;
        return response;
    }

    async deleteBookById(req) {
        const response = {};
        const { id } = req.params;
    
        const deletedBook = await this.bookRepo.deleteBookById(id);
        if (!deletedBook) {
          response.message = customResourceResponse.recordNotFound.message;
          response.statusCode = customResourceResponse.recordNotFound.statusCode;
          return response;
        }
    
        response.message = customResourceResponse.success.message;
        response.statusCode = customResourceResponse.success.statusCode;
        return response;
    }

}

module.exports = {
    BookService,
};