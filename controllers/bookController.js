var Book = require('../models/Book');

// Display list of all Book
exports.book_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Book list');
};

// Display detail page for a specific Book
exports.book_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
};

// Display Book create form on GET
exports.book_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book create POST');
};  

// Handle Book delete on POST
exports.book_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book delete POST');
};  

// Display Book update form on GET
exports.book_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle Book update on POST
exports.book_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book update POST');
};