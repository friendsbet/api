function create(modelName, data) {

}

function update(event) {
  event.preventDefault();

  var inputs = $(this).find('div.form-group > div.col-sm-10 > *');
  inputs = _.initial(inputs);
  console.log(inputs);
}

function destroy(modelName, data) {

}

$('form#update').on('submit', update);