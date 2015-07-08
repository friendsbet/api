$(function() {
  var url = window.location.href;

  function update(event) {
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

  function destroy() {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this instance!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      closeOnConfirm: false,
      closeOnCancel: false
    }, function(isConfirm) {
      if (isConfirm) {
        var $form = $('form#update');
        var id = $form.find('input#id')[0].value;
        var data = {
          _csrf: $form.find('input#_csrf')[0].value
        };

        // Prepare the request
        var request = $.ajax({
          method: 'DELETE',
          url: url, // Current URL (findOne page)
          data: data
        });

        request.done(function (message) {
          var title = 'Deleted!';
          var text = 'This instance has been deleted.\n' + 
                      'You will be redirected as soon as you click "OK"';
          var type = 'success';

          swal({
            title: title,
            text: text,
            type: type
          }, function () {
            window.location.href = url.substring(0, url.search(id) - 1);
          });
        });

        request.fail(function (message) {
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

  $('form#update').on('submit', update);
  $('form#update button#delete').on('click', destroy);
});
