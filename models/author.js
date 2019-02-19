var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date}
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function() {
  return this.family_name + ', ' + this.first_name;
});

// Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
// .get(function() {
//   return (this.date_of_birth.getYear() - this.date_of_death.getYear()).toString();
// });
.get(function() {
  var lifetime_string = '';
  if(this.date_of_birth) {
    lifetime_string = moment(this.date_of_birth).format('MMMM Do, YYYY');
  }
  lifetime_string += ' - ';
  if(this.date_of_death) {
    lifetime_string += moment(this.date_of_death).format('MMMM Do, YYYY');
  }
  return lifetime_string;
})

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function() {
  return '/catalog/author/' + this._id;
});

// Virtual for author's formatted date of birth
AuthorSchema
.virtual('date_of_birth_formatted')
.get(function() {
  return this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : '';
});

// Virtual for author's formatted date of death
AuthorSchema
.virtual('date_of_death_formatted')
.get(function() {
  return this.date_of_death ? moment(this.date_of_death).formate('YYYY-MM-DD') : '';
});

module.exports = mongoose.model('Author', AuthorSchema);