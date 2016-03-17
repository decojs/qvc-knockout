define([
  "qvc/utils/interpolate",
  "knockout"
], function(
  interpolate,
  ko
){

  function Validator(options){
    this.constraints = [];

    this.isValid = ko.observable(true);
    this.message = ko.observable("");

    this.name = options && options.name;
    this.path = options && options.path;
    this.executableName = options && options.executableName;
  }

  Validator.prototype.setConstraints = function(constraints){
    this.constraints = constraints;
  };

  Validator.prototype.reset = function(){
    this.isValid(true);
    this.message("");
  };

  Validator.prototype.validate = function(value){
    if(this.constraints.length == 0){
      this.reset();
    }else if(this.constraints.every(function (constraint) {
      if(constraint.validate(value)){
        return true;
      }else{
        this.isValid(false);
        this.message(interpolate(constraint.message, constraint.attributes, value, this.name, this.path));
        return false;
      }
    }.bind(this))){
      this.isValid(true);
      this.message("");
    }
  };

  return Validator;
});