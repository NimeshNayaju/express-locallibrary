var async = require('async');
const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

var Author = require('../models/author');
var Book = require('../models/book');

// Display list of all Authors
exports.author_list = function(req, res, next) {
  Author.find() //returns all Author objects
    .sort([['family_name', 'ascending']]) //sorts the returned objects by family_name in ascending order
    .exec(function(err, author_list) { //callback is passed to exec() with error and author_list parameter
      if(err) {
        return next(err); //if there is an error, it calls next middleware function with the error value
      }
      res.render('author_list', {title: 'Author List', author_list: author_list});
    });  
};

// Display detail page for a specific author
exports.author_detail = function(req, res, next) {
  async.parallel({
    author: function(callback) {
      Author.findById(req.params.id)
        .exec(callback);
    },
    author_book_list: function(callback) {
      Book.find({'author': req.params.id}, 'title summary')
        .exec(callback);
    }
  }, function(err, results) {
    if(err) {
      return next(err);
    }
    if(results.author == null) {
      var err = new Error('Author not found')
      err.status(404);
      return next(err);
    }
    res.render('author_detail', {title: 'Author Detail', author: results.author, author_book_list: results.author_book_list});
  });
};

// Display Author create form on GET
exports.author_create_get = function(req, res) {
  res.render('author_form', {title: 'Create Author'});
};  

// Display Author create form on POST
exports.author_create_post = [
  // Validate fields
  body('first_name').isLength({min: 1}).trim().withMessage('First name must be specified.')
    .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
  body('family_name').isLength({min: 1}).trim().withMessage('Family name must be specified.')
    .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
  body('date_of_birth', 'Invalid date of birth').optional({checkFalsy: true}).isISO8601(),
  body('date_of_death', 'Invalid date of death').optional({checkFalsy: true}).isISO8601(),

  // Sanitize fields
  sanitizeBody('first_name').trim().escape(),
  sanitizeBody('family_name').trim().escape(),
  sanitizeBody('date_of_birth').toDate(), //casts the parameter 'date_of_birth' received as a string into JavaScript types using toDate()
  sanitizeBody('date_of_death').toDate(),

  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract validation errors from a request
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      // renders the form again with sanitized values/errors messages in case of errors
      res.render('author', {tite: 'Create Author', author: req.body, errors: errors.array()});
      return;
    }
    else {
      // Data from the form is valid

      // Create an Author object with escaped and trimmed data
      var author = new Author (
        {
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death
      });
      
      author.save(function(err) {
        if(err) {
          return next(err);
        }
        res.redirect(author.url);
      });

    }
  }
]  

// Handle Author delete on GET
exports.author_delete_get = function(req, res, next) {
  async.parallel({
    author: function(callback) {
      Author.findById(req.params.id).exec(callback)
    },
    authors_books: function(callback) {
      Book.find({'author': req.params.id}).exec(callback)
    }
  }, function(err, results) {
    if(err) {
      return next(err);
    }
    if(results.author == null) {
      res.redirect('/catalog/authors');
    }
    res.render('author_delete', {title: 'Delete Author', author: results.author, author_books: results.authors_books});
  }); 
};  

// Handle Author delete on POST
exports.author_delete_post = function(req, res, next) {
  async.parallel({
    author: function(callback) {
      Author.findById(req.body.authorid).exec(callback)
    },
    authors_books: function(callback) {
      Book.find({'author': req.body.authorid}).exec(callback)
    }
  }, function(err, results) {
    if(err) {
      return next(err);
    }
    if(results.authors_books.length > 0) {
      // Author has books. Render in the same way as GET route
      res.render('author_delete', {title: 'Delete Author', author: results.author, author_books: results.authors_books});
      return;
    } else {
      // Author has no books. Delete objcet and redirect to the list of authors
      Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
        if(err) {
          return next(err);
        }
        res.redirect('/catalog/authors');
      })
    }
  }); 
};  

// Display Author update form on GET
exports.author_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST
exports.author_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author update POST');
};