$(document).ready(function() {
  jQuery(function($) {
    $('.phone').mask('+7 (999) 999-99-99');
  });

  $('#form-register').on('submit', function(e) {
    e.preventDefault();
    var form = $(this);
    var params = {};
    params.fullName =
      form.find('#inputFirstName').val() +
      ' ' +
      form.find('#inputLastName').val();
    params.phone = form.find('#inputPhone').val();
    params.email = form.find('#inputEmail').val();
    params.password = form.find('#inputPassword').val();
    params.role = form.find('#selectRole').val();
    $.ajax({
      type: 'POST',
      url: 'http://localhost:4000/api/register',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json',
      success: function(data) {
        alert('Регистрация прошла успешно!');
        console.log('Данные успешно отправлены');
        window.location.href = '/account/signin/';
      }
    });
  });

  $('#form-login').on('submit', function(e) {
    e.preventDefault();
    var form = $(this);
    var params = {};
    params.logemail = form.find('#logEmail').val();
    params.logpassword = form.find('#logPassword').val();
    $.ajax({
      type: 'POST',
      url: 'http://localhost:4000/api/signin',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json',
      complete: function(data) {
        window.location.href = data.responseText;
      }
    });
  });
});
