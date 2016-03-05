define([], function(){
  return {
    extend: function(dst, src){
      src = src || {};
      dst = dst || {};
      for(var i in src){
        dst[i] = src[i];
      }
      return dst;
    },

    inheritsFrom: function(o){
      function F() {}
      F.prototype = o.prototype;

      return new F();
    }
  };
});
