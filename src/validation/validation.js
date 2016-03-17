define([
  "qvc/validation/Validator",
  "qvc/constraints/Constraint",
  "knockout"
], function(
  Validator,
  Constraint,
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

  function applyConstraints(executableName, parameters, fields, resolveRule){
    return Promise.all(fields.map(function(field){
      var fieldName = field.name;
      var constraints = field.constraints;

      if(constraints == null || constraints.length == 0)
        return;

      var object = findField(fieldName, parameters, executableName, "Error applying constraints to field");

      if (ko.isObservable(object) && "validator" in object) {
        return Promise.all(constraints.map(function(constraint){
          return resolveRule(constraint.name).then(function(Rule){
            return new Constraint(constraint.name, constraint.attributes, Rule);
          });
        })).then(function(constraints){
          object.validator.setConstraints(constraints);
        });
      } else {
        throw new Error("Error applying constraints to field: " + fieldName + "\n" +
          "It is not an observable or is not extended with a validator. \n" +
          fieldName + "=`" + ko.toJSON(object) + "`");
      }
    }));
  };

  function applyViolations(executableName, parameters, validator, violations){
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

  return {
    recursivelyExtendParameters: recursivelyExtendParameters,
    findField: findField,
    applyValidatorTo: applyValidatorTo,
    applyViolationMessageToField: applyViolationMessageToField,
    applyViolationMessageToValidatable: applyViolationMessageToValidatable,
    applyConstraints: applyConstraints,
    applyViolations: applyViolations
  };
});