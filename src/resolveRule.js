define([], function(){
  return function(type){
    return new Promise(function(resolve, reject){
      require(["qvc/rules/" + type], resolve, reject);
    });
  };
});