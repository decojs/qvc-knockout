define(function(){
  return function addParamToUrl(url, name, value){
    return url + (url.match(/\?/) ? (url.match(/&$/) ? "" : "&") : "?") + encodeURIComponent(name) + "=" + encodeURIComponent(value);
  };
})