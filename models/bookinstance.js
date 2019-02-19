var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var BookInstanceSchema = new Schema (
  {
    book: {type: Schema.Types.ObjectId, ref: 'Book', required: true}, //reference to the associated book
    imprint: {type: String, require: true},
    status: {type: String, required: true, enum: ['Available, Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'}, //enum specifies the set of allowed values for a field
    due_back: {type: String, default: Date.now}
  }
);

// Virtual for bookinstance's URL
BookInstanceSchema
.virtual('url')
.get(function() {
  return '/catalog/bookinstance/' + this._id;
});

// Virtual for formatted due back date
BookInstanceSchema
.virtual('due_back_formatted')
.get(function() {
  return moment(this.due_back).format('MMMM Do, YYYY');
});

module.exports = mongoose.model('BookInstance', BookInstanceSchema);

