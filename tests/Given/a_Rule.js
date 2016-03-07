define(function(){
  return {
    asPromised: function(){
      return Promise.resolve(function Rule(){
        this.isValid = function(){
          return true;
        }
      });
    }
  };
})