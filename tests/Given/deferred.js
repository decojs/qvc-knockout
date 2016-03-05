define(function () {
  return function(){
    var resolve, reject;
    var promise = new Promise(function(res, rej){
      resolve = res;
      reject = rej;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
  };
});