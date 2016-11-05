// grab the articles as a json
$.getJSON('/articles', function(data) {
  // pick and display random article
  var random = Math.floor(Math.random() * data.length + 1)
    
  $('#articles').append('<p data-id="' + data[random]._id + '">' 
    + data[random].title + '<br /><br />'+ data[random].link + '</p>');

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
    // getSaved();
    console.log("data id = " + data._id);
    console.log("data title = " + data.title);
    if(data.note){
      for(var i = 0; i < data.note.length; i++) {
        $('#noteArea').append("<h5>" + data.note[i].body + '\n\n\n<button data-id="deleteNote">Delete</button></h5>');
        console.log("note id = " + data.note[i]._id);
      }    
    }
  
  });
   $('#noteArea').html('');
   // return true;
});

$(document).on('click', 'h5', function(){

      console.log("---------------------------------- $(document).on('click', '#deleteNote'");
var thisId = $('h5').attr('data-id');
console.log("----------------------------data-id = " + thisId);
$(this).remove();
// //   // update note
  // $.ajax({
  //   method: "DELETE",
  //   url: "/articles/" + thisId,
  // })
//   // clear note area
// var selected = $(this).parent();
  // make an AJAX GET request to delete the specific note 
  // this uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "GET",
    url: '/articles/' + $(this).data('data._id'), 

    // on successful call
    success: function(response){
      // remove the p-tag from the DOM
      // selected.remove();
      $(this).remove();

      // clear the note and title inputs
      $('#deleteNote').val("");
      console.log("&-&-&-&-&&-&-&-&-&-&- selected.data._id = " + selected.data('_id'))
    }
  });

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

    $.ajax({
    type: "GET",
    url: '/notes/' + thisId,

  })
    //append 
    // log the response
    // console.log("(*&(*(*)D)*)*_ _)* _)* _*  _* _* data = " + body);
   
    // $('#notes').empty();
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