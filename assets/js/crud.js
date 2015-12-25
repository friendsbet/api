/* global $, window, _, swal */

$(function() {
  var url = window.location.pathname;
  var baseUrl = window.location.origin;

  function create(event) {
    // Do not send the form
    event.preventDefault();

    var creationUrl = baseUrl + '/api' + url.substring(0, url.search('new') - 1);
    var redirectUrl = baseUrl + url.substring(0, url.search('new') - 1);
    
    // Get the inputs list and remove the submit button
    var inputs = $(this).find('input, select, textarea');

    // Map the inputs values
    var values = {};
    _.forEach(inputs, function (input) {
      values[input.name] = input.value;
    });

    // Prepare the request
    var request = $.ajax({
      method: 'POST',
      url: creationUrl, // Current URL (new page)
      data: values
    });

    request.done(function (data) {
      var title = 'Success!';
      var text = 'The instance has been created!\n' + 
                  'You will be redirected as soon as you click "OK"';
      var type = 'success';

      swal({
        title: title,
        text: text,
        type: type
      }, function () {
        window.location.href = redirectUrl + '/' + data.id;
      });
    });

    request.fail(function () {
      var title = 'Fail';
      var text = 'The instance coulnd\'t be created';
      var type = 'error';
      
      swal(title, text, type);
    });
  }

  function update(event) {
    // Do not send the form
    event.preventDefault();

    // Get the inputs list and remove the submit button
    var inputs = $(this).find('input, select, textarea');

    var updateUrl = baseUrl + '/api' + url;
    var redirectUrl = baseUrl + '/' + url.split('/')[1];

    // Map the inputs values
    var values = {};
    _.forEach(inputs, function (input) {
      values[input.name] = input.value;
    });

    // Prepare the request
    var request = $.ajax({
      method: 'PUT',
      url: updateUrl, // Current URL (findOne page)
      data: values
    });

    request.done(function () {
      var title = 'Success!';
      var text = 'The instance has been updated!\n' + 
                  'You will be redirected as soon as you click "OK"';
      var type = 'success';

      swal({
        title: title,
        text: text,
        type: type
      }, function () {
        window.location.href = redirectUrl;
      });
    });

    request.fail(function () {
      var title = 'Fail';
      var text = 'The instance coulnd\'t be updated';
      var type = 'error';
      
      swal(title, text, type);
    });
  }

  function destroy() {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this instance!\n' +
             'All associated resources will also be destroyed.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      closeOnConfirm: false,
      closeOnCancel: false
    }, function(isConfirm) {
      if (isConfirm) {
        var $form = $('form#update');
        var data = {
          _csrf: $form.find('input#_csrf')[0].value
        };

        var deleteUrl = baseUrl + '/api' + url;
        var redirectUrl = baseUrl + '/' + url.split('/')[1];

        // Prepare the request
        var request = $.ajax({
          method: 'DELETE',
          url: deleteUrl, // Current URL (findOne page)
          data: data
        });

        request.done(function () {
          var title = 'Deleted!';
          var text = 'This instance has been deleted.\n' + 
                      'You will be redirected as soon as you click "OK"';
          var type = 'success';

          swal({
            title: title,
            text: text,
            type: type
          }, function () {
            window.location.href = redirectUrl;
          });
        });

        request.fail(function () {
          var title = 'Fail';
          var text = 'The instance coulnd\'t be destroyed';
          var type = 'error';
          
          swal(title, text, type);
        });
      } else {
        swal('Cancelled', 'This instance is safe :)', 'error');
      }
    });
  }

  $('form#create').on('submit', create);
  $('form#update').on('submit', update);
  $('form#update button#delete').on('click', destroy);
});
