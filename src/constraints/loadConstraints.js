define([
  'qvc/utils/ajax'
], function(
  ajax
){
  return function loadConstraints(name, qvcConfig){
    var url = ajax.addToPath(qvcConfig.baseUrl, "constraints", name);
    return ajax(ajax.addParamToUrl(url, 'cacheKey', qvcConfig.cacheKey), null, "GET")
    .then(function(responseText){
      try{
        var response = JSON.parse(responseText || "{\"parameters\":[]}");
        return response.parameters || [];
      }catch(e){
        return [];
      }
    }, function(responseText){
      return [];
    });
  };
});