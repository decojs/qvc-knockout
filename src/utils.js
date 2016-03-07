define([], function(){
  return {
    inheritsFrom: function(o){
      function F() {}
      F.prototype = o.prototype;

      return new F();
    }
  };
});
