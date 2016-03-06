define([
  "qvc/Validator",
  "knockout"
], function(
  Validator,
  ko
){
  function recursivelyExtendParameters(parameters, executableName, parents) {
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
        result = result.concat(recursivelyExtendParameters(property, executableName, path));
      }
    }
    return result;
  }

  function findField(fieldPath, parameters, executableName, errorMessage){
    return fieldPath.split(".").reduce(function(object, name){
      var path = object.path;
      var field = ko.utils.unwrapObservable(object.field);
      if (name in field) {
        return {
          field: field[name],
          path: path + "." + name
        };
      } else {
        throw new Error(errorMessage + ": " + fieldPath + "\n" +
          name + " is not a member of " + path + "\n" +
          path + " = `" + ko.toJSON(field) + "`");
      }
    }, {
      field: parameters,
      path: executableName
    }).field;
  }

  function applyViolationMessageToField(parameters, fieldPath, executableName, message) {
    var object = findField(fieldPath, parameters, executableName, "Error applying violation");

    if (typeof message === "string" && "validator" in object) {
      object.validator.isValid(false);
      object.validator.message(message);
    }else{
      throw new Error("Error applying violation\n"+fieldPath+" is not validatable\nit should be an observable");
    }
  };

  function applyViolationMessageToValidatable(validatable, message) {
    validatable.validator.isValid(false);
    var oldMessage = validatable.validator.message();
    var newMessage = oldMessage.length == 0 ? message : oldMessage + ", " + message;
    validatable.validator.message(newMessage);
  };

  function applyValidatorTo(property, key, path, executableName){
    if('validator' in property && property.validator instanceof Validator){
      throw new Error("Observable `"+path+"` is parameter `"+property.validator.path+"` in "+property.validator.executableName+" and therefore cannot be a parameter in "+executableName+"!");
    }

    property.validator = new Validator(property, {
      name: key,
      path: path.join("."),
      executableName: executableName
    });

    property.subscribe(function (newValue) {
      property.validator.validate(newValue);
    });

    return property;
  }

  return {
    recursivelyExtendParameters: recursivelyExtendParameters,
    findField: findField,
    applyValidatorTo: applyValidatorTo,
    applyViolationMessageToField: applyViolationMessageToField,
    applyViolationMessageToValidatable: applyViolationMessageToValidatable
  };
});