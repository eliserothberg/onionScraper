var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request'); 
var cheerio = require('cheerio');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// make public a static dir
app.use(express.static('public'));


// Database configuration with mongoose
mongoose.connect('mongodb://localhost/onionScraper');
var db = mongoose.connection;

// show any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});


// And we bring in our Note and Article models
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

// GET request to scrape the Onion website.
app.get('/scrape', function(req, res) {
	// first, we grab the body of the html with request
  request('http://www.theonion.com/', function(error, response, html) {
  	// then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // now, we grab every h2 within an article tag, and do the following:
    $('h2.headline').each(function(i, element) {
      var result = {};
      var data = $(this);
     
      // save the text of each link enclosed in the current element
      var title = data.text();
      title = title.replace(/\n\r?/g, "").trim();
      var link = data.children().attr('href');
      var summary = data.prev().next('div.desc');
      var image = data.parent().prev().children('img');

      //  save  as properties of the result obj
      result.title = data.children().text();
      result.link = data.children().attr('href');
      result.summary = data.children().text();
      result.image = data.children('img');

				
			// pass the result object to the entry
			var entry = new Article (result);
				if (title && link) {
			// now, save that entry to the db
			entry.save(function(err, doc) {
				// log any errors
			  if (err) {
			    console.log(err);
			  } 
			  // or log the doc
			  else {
			    console.log(doc);
			  }
			});
		};
  });
});

res.redirect("/");
});

// get the articles 
app.get('/articles', function(req, res){
	Article.find({}, function(err, doc){
		// log any errors
		if (err){
			console.log(err);
		} 
		// or send the doc to the browser as a json object
		else {
			res.json(doc);
		}
	});
});

app.get('/articles/:id', function(req, res){
	// finds  matching id in db
	Article.findOne({'_id': req.params.id})
	//  populate all of the notes associated with it.
	.populate('note')

	.exec(function(err, doc){
		// log any errors
		if (err){
			console.log(err);
		} 
		// or send the doc to the browser as a json object
		else {
			res.json(doc);
		}
	});
});

// if no note exists for an article, make the posted note it's note.
app.post('/articles/:id', function(req, res){
	// create a new note and pass the req.body to the entry.
	var newNote = new Note(req.body);

	// and save the new note the db
	newNote.save(function(err, doc){
		// log any errors
		if(err){
			console.log(err);
		} 
		else {
			
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
			// execute the above query
			.exec(function(err, doc){

				// log any errors
				if (err){
					console.log(err);
				} else {
					// or send the document to the browser
					res.send(doc);
				}
			});
		}
	});
});

app.listen(3000, function() {
  console.log('App running on port 3000!');
});
