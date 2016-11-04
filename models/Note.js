// require mongoose
var mongoose = require('mongoose');
// create a schema class
var Schema = mongoose.Schema;

// create the Note schema
var NoteSchema = new Schema({
  body: {
    type:String,
    required:true
  }
});


// create the Note model with the NoteSchema
var Note = mongoose.model('Note', NoteSchema);

// export the Note model
module.exports = Note;
