define(["__mocked__"], function(realAjax){
  function ajax(url, object, method){
    ajax.spy(url, object, method);
    return new Promise(function(resolve, reject){
      if (ajax.responseCode === 200) {
        resolve(ajax.responseText);
      }else{
        reject(ajax.responseText);
      }
    });
  };
  ajax.responseCode = 200;
  ajax.responseText = "";
  ajax.spy = sinon.spy();
  ajax.addToPath = realAjax.addToPath;
  ajax.addParamToUrl = realAjax.addParamToUrl;
  ajax.addParamsToUrl = realAjax.addParamsToUrl;
  ajax.cacheBust = realAjax.cacheBust;
  ajax.reset = function(){
    ajax.spy.reset();
    ajax.responseCode = 200;
    ajax.responseText = "";
  }
  return ajax;
});