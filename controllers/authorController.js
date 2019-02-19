var Author = require('../models/author');

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
exports.author_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Author detail: ' + req.params.id);
};

// Display Author create form on GET
exports.author_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Author create GET');
};  

// Display Author create form on POST
exports.author_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author create POST');
};  

// Handle Author delete on GET
exports.author_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Author delete GET');
};  

// Handle Author delete on POST
exports.author_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author delete POST');
};  

// Display Author update form on GET
exports.author_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST
exports.author_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author update POST');
};