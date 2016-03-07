define(function(){
  return function Constraint(type, attributes, Rule){
    this.type = type;
    this.attributes = attributes;
    this.message = attributes.message;
    var rule = new Rule(attributes);
    this.validate = rule.isValid.bind(rule);
  };
});