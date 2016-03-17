define([
  'qvc/constraints/loadConstraints'
], function(
  loadConstraints
){
  function ConstraintResolver(config){
    this.config = config;
    this.constraints = Object.create(null);
  }

  ConstraintResolver.prototype.resolveConstraints = function(name){
    if(name in this.constraints === false){
      this.constraints[name] = loadConstraints(name, this.config);
    }

    return this.constraints[name];
  };

  return ConstraintResolver;
});