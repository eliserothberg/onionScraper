// require mongoose
var mongoose = require('mongoose');
// create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is required
  title: {
    type:String,
    required:true,
    unique:true
  },
  // link is required
  link: {
    type:String,
    required:true,
    unique:true
  },
   summary: {
    type:String,
    required:true
  },
  image: {
    type:String,
    required:false
  },
 note: [{
      // store ObjectIds in the array
      type: Schema.Types.ObjectId,
      // the ObjectIds will refer to the ids in the Note model
      ref: 'Note'
  }]
});


// Create the Article model with the ArticleSchema
var Article = mongoose.model('Article', ArticleSchema);

// export the model
module.exports = Article;
