define([
  "knockout"
], function(
  ko
){
  return function findField(fieldPath, parameters, executableName, errorMessage){
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
  };
});