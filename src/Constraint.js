define(["require"], function(require){
  
  function Constraint(type, attributes){    
    this.type = type;
    this.attributes = attributes;
    this.message = attributes.message;
    
    this.init(type);
  }
  
  Constraint.prototype.init = function(type){
    require(["qvc/constraints/" + type], function(Tester){
      var tester = new Tester(this.attributes);
      this.validate = tester.isValid.bind(tester);
    }.bind(this));
  };
  
  Constraint.prototype.validate = function(value){
    return true;//real test not loaded yet
  };
    
  return Constraint;
});