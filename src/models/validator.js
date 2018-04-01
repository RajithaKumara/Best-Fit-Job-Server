const validator = require('validator');
const mongoose = require('mongoose');
const { ObjectID } = require('mongoose');

class Validator {

  constructor() {
  }

  isName(_name) { //check name with spaces
    if (_name == undefined) {
      return false;
    }
    let array = _name.split(" ");
    let result = true;
    for (let i in array) {
      if (!validator.isAlpha(array[i])) {
        result = false;
      }
    }
    return result;
  }

  isEmail(_email) {
    if (_email == undefined) {
      return false;
    }
    return validator.isEmail(_email);
  }

  isValidObjectID(_id) {
    if (mongoose.Types.ObjectId.isValid(_id)) {
      return true;
    }
    return false;
  }

  isArray(_obj) {
    return Array.isArray(_obj);
  }
}

module.exports = Validator;