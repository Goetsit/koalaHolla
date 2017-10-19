console.log( 'js' );

$( document ).ready(readyNow);

function readyNow(){
  console.log( 'JQ' );
  // load existing koalas on page load
  getKoalas();
  // add koala button click
  $( '#addButton' ).on( 'click', addButtonClick);
  $( '#viewKoalas' ).on('click', '.delete', deleteKoala);
  $( '#viewKoalas' ).on('click', '.transfer', markReadyForTransfer);
  $( '#viewKoalas').on('click', '.editKoalas', editKoalasFunction)
}

var editing = false;
var editingId = 0;

function addButtonClick(){
  console.log( 'in addButton on click' );
  var name = $('#nameIn').val();
  var age = $('#ageIn').val();
  var gender = $('#genderIn').val();
  var readyForTransfer = $('#readyForTransferIn').val();
  var notes = $('#notesIn').val();
  // get user input and put in an object
  // NOT WORKING YET :(
  // using a test object
  var objectToSend = {
    name: name,
    age: age,
    gender: gender,
    readyForTransfer: readyForTransfer,
    notes: notes
  }

  if(editing === true){
    editing = false;
    sendEdits();
  } else {
    // call saveKoala with the new obejct
    saveKoala( objectToSend );
  }

}

// GET AJAX call to server to get koalas
function getKoalas(){
  console.log( 'in getKoalas' );
  $.ajax({
    type: 'GET',
    url: '/koalas'
  }).done(function(response){
    console.log( 'got some koalas: ', response );
    //Append to dom function
    appendToDom(response);
  }).fail(function(error){
    console.log('GET failed:', error);
  })
}

// POST AJAX call to server to add new Koala
function saveKoala( newKoala ){
  console.log( 'in saveKoala', newKoala );
  $.ajax({
    type: 'POST',
    url: '/koalas',
    data: newKoala
  }).done(function(response){
    console.log('Success:', response);
    getKoalas();
  }).fail(function(error){
    console.log('Failed:',error);
  })
}

//DELETE AJAX call to remove a koala
function deleteKoala(){
  id = $(this).parent().parent().data('koala.id');
  console.log(id);
  $.ajax({
    method: 'DELETE',
    url: '/koalas/' + id
  }).done(function(response){
    getKoalas();
  }).fail(function(error){
    console.log('Error deleting', error);
  })
}

function appendToDom(koalas) {
  $('#viewKoalas').empty();
  for(var i=0; i<koalas.length; i++){
    if(koalas[i].readyfortransfer === false){
      var button = '<button class="transfer">Ready for transfer</button>';
      //var koala = koalas[i];
    } else {
      button = '';
    }
    var $tr = $('<tr data-id="' + koalas[i].id + '"><td>' + koalas[i].name + '</td><td>' + koalas[i].age + '</td><td>' + koalas[i].gender + '</td><td>' + koalas[i].readyfortransfer + '</td><td>' + koalas[i].notes + '</td><td>' + button + '</td><td>' + '<button class="editKoalas">Edit</button>' + '</td><td>' + '<button class="delete">Delete</button>' + '</td></tr>');
    $tr.data('koala', koalas[i]);
    $('#viewKoalas').append($tr);
  }
}

function markReadyForTransfer() {
  id = $(this).parent().parent().data('koala.id');
  console.log(id);
  $.ajax({
    method: 'PUT',
    url: '/koalas/ready/' + id,
  }).done(function(response){
    getKoalas();
  }).fail(function(error){
    console.log('Error marking ready for transfer', error);
  })
}

function editKoalasFunction(){

  var name = $(this).closest('tr').data('koala.name');
  var age = $(this).closest('tr').data('koala.age');
  var gender = $(this).closest('tr').data('koala.gender');
  var readyForTransfer = $(this).closest('tr').data('koala.readyfortransfer');
  var notes = $(this).closest('tr').data('koala.notes');
  editingId = $(this).closest('tr').data('koala').id;
  console.log('Editing ID is ', editingId);
  $('#nameIn').val(name);
  $('#ageIn').val(age);
  $('#genderIn').val(gender);
  $('#readyForTransferIn').val(readyForTransfer);
  $('#notesIn').val(notes);
}; // end PUT ajax

function sendEdits() {
  var name = $('#nameIn').val(name);
  var age = $('#ageIn').val(age);
  var gender = $('#genderIn').val(gender);
  var readyForTransfer = $('#readyForTransferIn').val(readyForTransfer);
  var notes = $('#notesIn').val(notes);
  
  var updateKoala = {
    name: name,
    age: age,
    gender: gender,
    readyfortransfer: readyForTransfer,
    notes: notes
  }
  
  $.ajax({
    method: 'PUT',
    URL: '/koalas/' + editingId,
    data: updateKoala
  }).done(function(response){
    console.log('send edits function response:', response)
    getKoalas();
  }).fail(function(error){
    console.log('error getting update koalas back:' , error)
  })
}
