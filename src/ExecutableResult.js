define(function(){
  function ExecutableResult(result){
    result = result || {};

    this.success = result.success || false;
    this.valid = result.valid || false;
    this.result = result.result || null;
    this.exception = result.exception || null;
    this.violations = result.violations || [];
  };

  return ExecutableResult;
});