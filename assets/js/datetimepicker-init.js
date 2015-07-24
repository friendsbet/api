$(function () {
  var fields = $('div.input-group.date');

  _.forEach(fields, function (field) {
    var $field = $(field);
    $field.datetimepicker({
      locale: 'fr',
      defaultDate: $field.find('input').value,
      format: 'YYYY-MM-DDTHH:mm:00Z'
    });
  });
});