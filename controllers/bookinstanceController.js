var BookInstance = require('../models/bookinstance');

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
exports.bookinstance_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance create GET');
};  

// Display BookInstance create form on POST
exports.bookinstance_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance create POST');
};  

// Handle BookInstance delete on GET
exports.bookinstance_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance delete GET');
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