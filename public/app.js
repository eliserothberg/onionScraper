// grab the articles as a json
$.getJSON('/articles', function(data) {
  // pick and display random article
  var random = Math.floor(Math.random() * data.length + 1)
    
  $('#articles').append('<p data-id="' + data[random]._id + '">' 
    + data[random].title + '<br />'+ data[random].link + '</p>');

  $("#addNote").data('id', data[random]._id);
});

// $(document).ready(function() {
//     $('p').load('click');
// });

// $(document).ready(function() {
// when p tag clicked
$(document).on('click', 'p', function(){

  console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX  $(document).on('click', 'p',");

  // $('#notes').empty();
  // location.reload();
  var thisId = $(this).attr('data-id');
  $.ajax({
    type: "GET",
    url: '/articles/' + thisId,
  })
 
  //add note information to the page
  .done(function(data) {
    getSaved();
    console.log(data._id + " = data id");
    console.log(data.title + " = data title");
    if(data.note){
      for(var i = 0; i < data.note.length; i++) {
        $('#noteArea').append("<p>" + data.note[i].body + '\n\n<button data-id="deleteNote">Delete Note</button></p>');
        // $('#noteArea').append("<p>" + data.note[i].body + "</p>");
        // console.log("data.note[i].body = " + data.note.body);
        // $(document).on('click', '#deleteNote', function(){
        //   $('#notes').clear(data[i].body);
        // });
      }    
    // the title of the article
    // $('#noteArea').prepend('<h5>' + data.title + '</h5>'); 

    // $('#notes').append('<div id="noteArea" name="body"></div>'); 

    // $('#notes').append('<button data-id="' + data._id + '" id="addNote">Save Note</button>');
    // $('#notes').append('<button data-id="' + data._id + '" id="deleteNote">Delete Note</button>');
    // if there's a note associated with the article
    
    }
  
  });
   $('#noteArea').html('');
   return true;
});

//append a delete button with each note

$(document).on('click', '#deleteNote', function(){
  
  $(this).remove()

      console.log("---------------------------------- $(document).on('click', '#deleteNote'");
var thisId = $(this).data('id');
console.log("----------------------------thisId = " + thisId);

//   // update note
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId,
  })
//   // clear note area

});

$(document).on('click', '#addNote', function(e){
      console.log("++++++++++++++++++++++++++++++ $(document).on('click', '#addNote'");
      e.preventDefault();
  // grab the id associated with the article from the submit button
  //add the data-id to the addNote or jquery search for data-id
  var thisId = $(this).data('id');

  // update note
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      body: $('#noteEntry').val() 
    }
  })
  .done(function(data) {

    // log the response
    // console.log("(*&(*(*)D)*)*_ _)* _)* _*  _* _* data = " + body);
   
    $('#notes').empty();
     $('#noteEntry').val("");
    // return false;
  });
 return false;

});

function getSaved(){
  $('#notes').empty();
  $.getJSON('/notes', function(data) {
    for (var i = 0; i<data.length; i++){
      $('#notes').prepend(data[i].body);
    }
  });
}
getSaved();

$('.reset').click(function() {
    location.reload();
});