define([
  'knockout',
  'qvc/ajax',
  'qvc/ExecutableResult'
], function(
  ko,
  ajax,
  ExecutableResult
){
  return function execute(type, name, parameters, qvcConfig){
    var parameters = ko.toJS(parameters);
    var data = {
      parameters: JSON.stringify(parameters),
      csrfToken: qvcConfig.csrf
    };
    var url = ajax.addToPath(qvcConfig.baseUrl, type, name);
    return ajax(url, data, "POST")
    .then(function (responseText) {
      return new ExecutableResult(JSON.parse(responseText || "{}"));
    }, function(responseText){
      return new ExecutableResult({exception: {message: responseText}});
    });
  };
});