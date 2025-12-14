class BookRepository{
    constructor(bookModel){
        this.bookModel = bookModel;
    }

    addBook(id, title, author, year){
        return this.bookModel.create({
            id,
            title,
            author, 
            year,
        });
    }

    getAllBooks(){
        return this.bookModel.find();
    }

    getBookById(id){
        return this.bookModel.findOne({id});
    }


    updateBookById(id, title, author, year){
        return this.bookModel.findOneAndUpdate({id},{
            $set: {title, author, year} 
        }, {new: true});
    }

    deleteBookById(id){
        return this.bookModel.findOneAndDelete({id});
    }
}

module.exports = {
    BookRepository,
};