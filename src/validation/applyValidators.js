define([
  "qvc/validation/Validator",
  "knockout"
], function(
  Validator,
  ko
){
  function applyValidatorTo(property, key, path, executableName){
    if('validator' in property && property.validator instanceof Validator){
      throw new Error("Observable `"+path+"` is parameter `"+property.validator.path+"` in "+property.validator.executableName+" and therefore cannot be a parameter in "+executableName+"!");
    }

    property.validator = new Validator({
      name: key,
      path: path.join("."),
      executableName: executableName
    });

    property.isValid = ko.pureComputed(property.validator.isValid);
    property.subscribe(function (newValue) {
      property.validator.validate(newValue);
    });

    return property;
  }

  return function applyValidators(parameters, executableName, parents) {
    parents = parents || [];
    var result = [];
    for (var key in parameters) {
      var property = parameters[key];
      var path = parents.concat([key]);
      if (ko.isObservable(property)) {
        result.push(applyValidatorTo(property, key, path, executableName));
      }
      property = ko.utils.unwrapObservable(property);
      if (typeof property === "object") {
        result = result.concat(applyValidators(property, executableName, path));
      }
    }
    return result;
  }
});