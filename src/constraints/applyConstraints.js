define([
  "qvc/validation/findField",
  "qvc/constraints/Constraint",
  "knockout"
], function(
  findField,
  Constraint,
  ko
){
  return function applyConstraints(executableName, parameters, fields, resolveRule){
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
});
