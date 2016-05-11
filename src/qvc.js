define([
  "qvc/executable/createExecutable",
  "qvc/executable/createSimpleExecutable",
  "qvc/constraints/ConstraintResolver",
  "qvc/constraints/resolveRule",
  "knockout",
  "qvc/koExtensions"
], function(
  createExecutable,
  createSimpleExecutable,
  ConstraintResolver,
  resolveRule,
  ko
){

  function QVC(){
    this.config = {
      baseUrl: "/qvc",
      csrf: "",
      cachekey: Date.now(),
      resolveRule: resolveRule
    };

    this.constraintResolver = new ConstraintResolver(this.config);
  };

  var qvc = new QVC();

  return {
    createCommand: function(name, parameters, hooks){
      if(name == null || name.length == 0)
        throw new Error("Command is missing name\nA command must have a name!\nusage: createCommand('name', {parameters}, {hooks})");
      return createExecutable(name, 'command', parameters || {}, hooks || {}, qvc);
    },
    createQuery: function(name, parameters, hooks){
      if(name == null || name.length == 0)
        throw new Error("Query is missing name\nA query must have a name!\nusage: createQuery('name', {parameters}, {hooks})");
      return createExecutable(name, 'query', parameters || {}, hooks || {}, qvc);
    },
    executeCommand: function(name, parameters, hooks){
      if(name == null || name.length == 0)
        throw new Error("Command is missing name\nA command must have a name!\nusage: executeCommand('name', {parameters}, {hooks})");
      return createSimpleExecutable(name, 'command', parameters || {}, hooks || {}, qvc)();
    },
    executeQuery: function(name, parameters, hooks){
      if(name == null || name.length == 0)
        throw new Error("Query is missing name\nA query must have a name!\nusage: createQuery('name', {parameters}, {hooks})");
      return createSimpleExecutable(name, 'query', parameters || {}, hooks || {}, qvc)();
    },
    config: function(config){
      config = config || {};
      for(var key in config){
        if (config.hasOwnProperty(key)) {
          qvc.config[key] = config[key];
        }
      }
    }
  }
});