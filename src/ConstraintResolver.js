define([], function(){
  function ConstraintResolver(qvc){
    this.qvc = qvc;
    this.constraints = Object.create(null);
  }

  ConstraintResolver.prototype.applyValidationConstraints = function(name){
    return this.constraints[name] || this.addConstraints(name);
  };

  ConstraintResolver.prototype.addConstraints = function(name){
    var qvc = this.qvc;
    return this.constraints[name] = new Promise(function(resolve){
      qvc.loadConstraints(name, resolve);
    });
  }

  return ConstraintResolver;
});