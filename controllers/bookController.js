var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

var async = require('async');
var mongoose = require('mongoose');
const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

exports.index = function(req, res) {
  async.parallel({
    book_count: function(callback) {
      Book.countDocuments({}, callback); // pass an empty object as match condition to find all documents of this collection
    },
    book_instance_count: function(callback) {
      BookInstance.countDocuments({}, callback);
    }, 
    book_instance_available_count: function(callback) {
      BookInstance.countDocuments({status: 'Available'}, callback);
    },
    author_count: function(callback) {
      Author.countDocuments({}, callback);
    },
    genre_count: function(callback) {
      Genre.countDocuments({}, callback);
    }
  }, function(err, results) {
    res.render('index', {title: 'Local Library Home', error: err, data: results})
  });
};

// Display list of all Book
exports.book_list = function(req, res, next) {
  Book.find({}, 'title author') //returns all Book objects, selecting to return only title and author(and id and virtual fields)
    .populate('author') //replaces stored book author with full author details
    .exec(function (err, book_list) {
      if (err) {
        return next(err);
      }
      res.render('book_list', {title: 'Book List', book_list: book_list});
    });
};

// Display detail page for a specific Book
exports.book_detail = function(req, res, next) {
  // var id = mongoose.Types.ObjectId(req.params.id);
  async.parallel({
    book: function(callback) {
      Book.findById(req.params.id)
        .populate('author')
        .populate('genre')
        .exec(callback);
    },  
    book_instance_list: function(callback) {
      BookInstance.find({'book': req.params.id})
        .exec(callback);
    }
  }, function(err, results) {
    if(err) {
      return next(err);
    }
    if(results.book == null) {
      var err = new Error('Book not found!');;
      err.status = 404;
      return next(err);
    }
    res.render('book_detail', {title: 'Book Detail', book: results.book, book_instance_list: results.book_instance_list});
  })
};

// Display Book create form on GET
exports.book_create_get = function(req, res, next) {
  async.parallel({
    // Gets all authors and genres for form
    authors: function(callback) {
      Author.find(callback);
    },
    genres: function(callback) {
      Genre.find(callback);
    }
  }, function(err, results) {
    if(err) {
      return next(err);
    }
    res.render('book_form', {title: 'Create a book', authors: results.authors, genres: results.genres});
  });
};  

// Display Book create form on POST
exports.book_create_post = [
  // Sanitize the genre information by converting the genre to an array
  (req, res, next) => {
    if(!(req.body.genre instanceof Array)) {
      if(typeof req.body.genre === 'undefined') {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },

  // Validate fields
  body('title', 'Title field can not be empty').isLength({min: 1}).trim(),
  body('author', 'Author field can not be empty').isLength({min: 1}).trim(),
  body('summary', 'Summary field can not be empty').isLength({min: 1}).trim(),
  body('isbn', 'ISBN field can not be empty').isLength({min: 1}).trim(),

  // Sanitize fields (using a wildcard)
  sanitizeBody('*').trim().escape(),

  // Process requests after validation and sanitization
  (req, res, next) => {

    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a Book object with sanitized data
    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre
    });

    if(!errors.isEmpty()) {
      // render the form again with sanitized values/errors messages in case of errors
      // Get all authors and genres for form
      async.parallel({
        authors: function(callback) {
          Author.find(callback);
        },
        genres: function(callback) {
          Genre.find(callback);
        }
      }, function(err, results) {
        if(err) {
          return next(err);
        }
        
        // Mark our selected genres as checked
        // iterate throught all genres and add checked='true' parameter to those that were in our post data
        for (let i = 0; i < results.genres.length; i++) {
          if(book.genre.indexOf(results.genres[i]._id) > -1) {
            // Current genre is selected. Set "checked" flag
            results.genres[i].checked = 'true';
          }
        }
        res.render('book_form', {title: 'Create a Book', authors: results.authors, genres: results.genres, book: book, errors: errors.array()})
      });
      return;
    }
    else {
      // Data from the form is valid
      book.save(function(err) {
        if(err) {
          return next(err);
        }
        res.redirect(book.url);
      });
    }
  }
];  

// Handle Book delete on GET
exports.book_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book delete GET');
};  

// Handle Book delete on POST
exports.book_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book delete POST');
};  

// Handle Book update on GET
exports.book_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle Book update on POST
exports.book_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book update POST');
};

