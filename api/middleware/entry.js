const Validator = require('validator');
const isEmpty = require('./empty');

module.exports = function validateEntryInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.text = !isEmpty(data.text) ? data.text : '';
    data.user = !isEmpty(data.user) ? data.user : '';

    if(!Validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = 'Name must be between 2 to 30 chars';
    }
    if(Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }
    if(Validator.isEmpty(data.text)) {
        errors.text = 'Text field is required';
    }
    if(Validator.isEmpty(data.user)) {
        errors.user = 'Server error occured';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};