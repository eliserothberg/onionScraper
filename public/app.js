// grab the articles as a json
$.getJSON('/articles', function(data) {
  // for each one
  var random = Math.floor(Math.random() * 50 + 1)
  // for (var i = 0; i<data.length; i++){
    // display the apropos information on the page
    $('#articles').append('<p data-id="' + data[random]._id + '">'+ data[random].title + '<br />'+ data[random].link + '</p>');
  // }
});

// whenever someone clicks a p tag
$(document).on('click', 'p', function(){

  // empty the notes from the note section
  
  // save the id from the p tag
  var thisId = $(this).attr('data-id');
// $('#notes').append(thisId);
  // now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .done(function( data ) {
      console.log(data);
      // the title of the article
      $('#notes').append('<h5>' + data.title + '</h5>'); 
      
      //textarea to add new note 
      $('#notes').append('<textarea id="bodyinput" name="body"></textarea>'); 

      // a button to submit a new note, with the id of the article saved to it
      $('#notes').append('<button data-id="' + data._id + '" id="saveNote">Save Note</button>');
      // a button to delete note, with the id of the article saved to it
      $('#notes').append('<button data-id="' + data._id + '" id="deleteNote">Delete Note</button>');

      // if there's a note in the article
      if(data.notes){
        // place the body of the note in the body textarea
        $('#bodyinput').val(data.notes.body);
      }
    });
$(document).on('click', '#deleteNote', function(){
  
  $('#bodyinput').val("");
});
// when you click the savenote button
$(document).on('click', '#saveNote', function(){
  // grab the id associated with the article from the submit button
  var thisId = $(this).attr('data-id');

  // run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      body: $('#bodyinput').val() // value taken from note textarea
    }
  })
    // with that done
    .done(function(data) {
      // log the response
      console.log(data);
      // empty the notes section
      $('#notes').empty();
    });
});
  // clear inputs
  $('#bodyinput').val("");
});
//reload page on click
$('#reset').click(function() {
    location.reload();
});