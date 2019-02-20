var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

// Display list of all BookInstance
exports.bookinstance_list = function(req, res, next) {
  BookInstance.find() //retuns all BookInstance objects
    .populate('book') //replaces book id stored for each BookInstance with a full Book document
    .exec(function(err, bookinstance_list) {
      if(err) {
        return next(err);
      }
      res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list: bookinstance_list});
    });
};

// Display detail page for a specific BookInstance
exports.bookinstance_detail = function(req, res, next) {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function(err, bookinstance) {
      if(err) {
        return next(err);
      }
      if(bookinstance == null) {
        var err = new Error('Book instance not found');
        err.status = 404;
        return next(err);
      }
      res.render('bookinstance_detail', {title: 'Book:', bookinstance: bookinstance})
    })
};

// Display BookInstance create form on GET
exports.bookinstance_create_get = function(req, res, next) {
  Book.find({}, 'title')
    .exec(function (err, books) {
      if(err) {
        return next(err);
      }
      res.render('bookinstance_form', {title: 'Create BookInstance', book_list: books});
    });
};  

// Display BookInstance create form on POST
exports.bookinstance_create_post = [
  // Validate fields
  body('book', 'Book must be specified').isLength({min: 1}).trim(),
  body('imprint', 'Imprint must be specified').isLength({min: 1}).trim(),
  body('due_back', 'Invalid date').optional({checkFalsy: true}).isISO8601(),

  // Sanitize fields
  sanitizeBody('book').trim().escape(),
  sanitizeBody('imprint').trim().escape(),
  sanitizeBody('status').trim().escape(), 
  sanitizeBody('due_back').toDate(),

  // Porcess request after validation and sanitization
  (req, res, next) => {
    
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data
    var bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back
    });

    if(!errors.isEmpty()) {
      // Renders the form again with sanitized values and error messages in case of error
      Book.find({}, 'title')
        .exec(function(err, books) {
          if(err) {
            return next(err);
          }
          res.render('bookinstance_form', {title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book._id, errors: errors.array(), bookinstance: bookinstance})
        });
        return;
    }
    else {
      // Data from the form is valid
      bookinstance.save(function(err) {
        if(err) {
          return next(err);
        }
        res.redirect(bookinstance.url);
      });
    }
  }
]

// Handle BookInstance delete on GET
exports.bookinstance_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance create POST');
};  

// Handle BookInstance delete on POST
exports.bookinstance_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance delete POST');
};  

// Display BookInstance update form on GET
exports.bookinstance_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle BookInstance update on POST
exports.bookinstance_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update POST');
};