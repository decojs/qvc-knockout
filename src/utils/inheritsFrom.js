define(function(){
  return function inheritsFrom(o){
    function F() {}
    F.prototype = o.prototype;

    return new F();
  };
});
