define(function(){
  return function addToPath(url, segment){
    for(var i=1; i<arguments.length; i++){
      segment = arguments[i];
      url = url + (url[url.length-1] == '/' ? "" : "/") + segment;
    }
    return url;
  };
});