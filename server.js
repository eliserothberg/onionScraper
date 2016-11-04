var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request'); 
var cheerio = require('cheerio');

app.use(logger('dev'));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

mongoose.connect('mongodb://localhost/onionScraper');
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

db.once('open', function() {
  console.log('Mongoose connection successful.');
});

var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

app.get('/', function(req, res) {
  res.send(index.html);
});

// GET request to scrape the Onion website.
app.get('/scrape', function(req, res) {
	// get html
  request('http://www.theonion.com/', function(error, response, html) {
  	// load cheerio
    var $ = cheerio.load(html);
    
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
      result.title = data.children('a').text();
      result.link = data.children().attr('href');
      result.summary = data.children('a').text();
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
    console.log("******************************* app.get('/articles',");

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

app.get('/notes', function(req, res) {
  console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% app.get('/notes',");
  // find all notes in the note collection with our Note model
  Note.find({}, function(err, doc) {
    // send any errors to the browser
    if (err) {
      res.send(err);
    } 
    // or send the doc to the browser
    else {
      res.send(doc);
    }
  });
});

app.get('/articles/:id', function(req, res){
   console.log("========================== app.get('/articles/:id and req.params.id = " + req.params.id);
  // finds  matching id in db
  Article.findOne({'_id': req.params.id})
  //  populate all of the notes associated with it.
  .populate('note')

  .exec(function(err, doc){
    console.log(JSON.stringify(doc));
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

//THIS IS NO LONGER WORKING AND I HAVEN'T A CLUE AS TO WHY
app.post('/articles/:id', function(req, res){
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~ app.post('/articles/:id and req.params.id = " + req.params.id);
	// create a new note and pass the req.body to the entry.
	var newNote = new Note(req.body);

	// and save the new note the db
	newNote.save(function(err, doc){

		// log any errors
		if(err){
			console.log(err);
		} 
		else {
			
			Article.findOneAndUpdate({'_id': req.params.id}, {$push: {'note':doc._id}})
            // Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id}, {new: true})
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
// Note.aggregate([
//     {$group: {_id: '$_post', notes: {$push: '$body'}}}
//     // ...
//     ], function(err, result) {
//         if (err)
//            // error handling
//         Note.populate(result, {path: "_id"}, function(err, ret) {
//             if(err)
//                 console.log(err);
//             else
//                 console.log(ret);
//         });
// });


app.delete('/notes/:id', function (req, res) { 
  Note.findById(req.params.article_id, function(note){ 
    note.remove(); 
    console.log("comment succesfully deleted!"); 
    // res.redirect("back"); 
  }); 
});

app.listen(3000, function() {
  console.log('App running on port 3000!');
});
