// Make connection
var socket = io.connect('http://localhost:4000');

// Query DOM
var message = $('#message');
// var handle = $('#handle');
var btn = $('#send');
var output = $('#output');
var feedback = $('#feedback');

var typingTimer; //timer identifier

//Emit Events
btn.click(function() {
  if (message.val() != '') {
    socket.emit('chat', {
      message: message.val(),
      handle: fromName,
      who: false
    });
  }
});

message.keyup(function() {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(function() {
    socket.emit('stopTyping', true);
  }, 5000);
});

message.keydown(function(e) {
  if (e.which === 13 && e.shiftKey == false && message.val() != '') {
    socket.emit('chat', {
      message: message.val(),
      handle: fromName,
      who: false
    });
  }
  clearTimeout(typingTimer);
});

$(document).keypress(function() {
  message.focus();
});

message.keypress(function() {
  socket.emit('typing', fromName);
});

//Listen for Events
socket.on('chat', function(data) {
  var who = '';
  if (data.who == true) {
    who = ' your';
  }
  output.append(
    '<div class="msg' +
      who +
      '"><img src="/img/ava.png" alt="ava">' +
      '<div class="info"><h3>' +
      data.handle +
      '</h3><p>' +
      data.message +
      '</p></div></div>'
  );
  message.val('');
});

socket.on('typing', function(data) {
  feedback.html('<p><em>' + data + ' набирает сообщение...</em></p>');
  feedback.fadeIn();
});

socket.on('stopTyping', function(data) {
  if (data) {
    feedback.fadeOut();
  }
});

$(document).ready(function() {
  message.focus();
  //   message.blur(() => {
  //     message.focus();
  //   });
  let height_window = $('#output').height();

  $('#chat-window').scrollTop(height_window);

  $('#message-form').on('submit', function(e) {
    e.preventDefault();
    var form = $(this);
    var params = {};

    params.message = form.find('#message').val();
    params.from = from;
    params.fromName = fromName;
    params.who = who;
    let messageURL = 'http://localhost:4000/chat/im/' + to + '/send';
    $.ajax({
      type: 'POST',
      url: messageURL,
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json',
      complete: function() {
        // console.log('Сообщение успешно отправлено!');
        height_window += 84;
        console.log(height_window);
        $('#chat-window').scrollTop(height_window);
      }
    });
  });
});
