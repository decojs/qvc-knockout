define(['qvc/constraints/Constraint'], function(Constraint){
  return {
    whichIsInvalid: function(type, message, attributes){
      attributes = attributes || {};
      message = message || "invalid";
      attributes.message = message;
      return new Constraint(type || "dummy", attributes, function(){this.isValid = sinon.stub().returns(false)});
    }
  }
});