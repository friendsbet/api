$(function() {
  function update(event) {
    var url = window.location.href;

    // Do not send the form
    event.preventDefault();

    // Get the inputs list and remove the submit button
    var inputs = $(this).find('input, select, textarea');

    // Map the inputs values
    var values = {};
    _.forEach(inputs, function (input) {
      values[input.name] = input.value;
    });

    // Prepare the request
    var request = $.ajax({
      method: 'PUT',
      url: url, // Current URL (findOne page)
      data: values
    });

    request.done(function (message) {
      var title = 'Success!';
      var text = 'The instance has been updated!\n' + 
                  'You will be redirected as soon as you click "OK"';
      var type = 'success';

      swal({
        title: title,
        text: text,
        type: type
      }, function () {
        window.location.href = url.substring(0, url.search(values.id) - 1);
      });
    });

    request.fail(function (message) {
      var title = 'Fail';
      var text = 'The instance coulnd\'t be updated';
      var type = 'error';
      
      swal(title, text, type);
    });
  }

  $('form#update').on('submit', update);
});