define([
  "qvc/validation/findField",
  "knockout"
], function(
  findField,
  ko
){
  function applyViolationMessageToField(parameters, fieldPath, executableName, message) {
    var object = findField(fieldPath, parameters, executableName, "Error applying violation");

    if (typeof message === "string" && ko.isObservable(object) && "validator" in object) {
      object.validator.isValid(false);
      object.validator.message(message);
    }else{
      throw new Error("Error applying violation\n"+fieldPath+" is not validatable\nit should be an observable");
    }
  };

  function applyViolationMessageToValidatable(validator, message) {
    validator.isValid(false);
    var oldMessage = validator.message();
    var newMessage = oldMessage.length == 0 ? message : oldMessage + ", " + message;
    validator.message(newMessage);
  };

  return function applyViolations(executableName, parameters, validator, violations){
    violations.forEach(function(violation){
      var message = violation.message;
      var fieldName = violation.fieldName;
      if (fieldName && fieldName.length > 0) {
        //one of the fields violates a constraint
        applyViolationMessageToField(parameters, fieldName, executableName, message);
      } else {
        //the validatable violates a constraint
        applyViolationMessageToValidatable(validator, message);
      }
    });
  };
});
