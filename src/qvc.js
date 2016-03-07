define([
  "qvc/Executable",
  "qvc/ConstraintResolver",
  "knockout",
  "qvc/koExtensions"],
  function(
    Executable,
    ConstraintResolver,
    ko){

  function QVC(){
    this.config = {
      baseUrl: "/qvc",
      csrf: "",
      cachekey: Date.now()
    };

    this.constraintResolver = new ConstraintResolver(this.config);
  };

  var qvc = new QVC();

  function createExecutable(name, type, parameters, callbacks){
    var executable = new Executable(name, type, parameters || {}, callbacks || {}, qvc);
    var execute = executable.execute.bind(executable);
    execute.isValid = ko.pureComputed(executable.isValid, executable);
    execute.isBusy = ko.pureComputed(executable.isBusy, executable);
    execute.hasError = ko.pureComputed(executable.hasError, executable);
    execute.onSuccess = function(callback){
      executable.hooks.success = callback;
      return execute;
    };
    execute.onError = function(callback){
      executable.hooks.error = callback;
      return execute;
    };
    execute.onInvalid = function(callback){
      executable.hooks.invalid = callback;
      return execute;
    };
    execute.beforeExecute = function(callback){
      executable.hooks.beforeExecute = callback;
      return execute;
    };
    execute.canExecute = function(callback){
      executable.hooks.canExecute = callback;
      return execute;
    };
    execute.result = function(){
      if(arguments.length == 1){
        executable.hooks.result = arguments[0];
        return execute;
      }
      return executable.result.result;
    };
    execute.onComplete = function(callback){
      executable.hooks.complete = callback;
      return execute;
    };
    execute.clearValidationMessages = executable.clearValidationMessages.bind(executable);
    execute.validator = executable.validator;
    execute.parameters = executable.parameters;
    execute.validate = executable.validate.bind(executable);

    return execute;
  }

  return {
    createCommand: function(name, parameters, hooks){
      if(name == null || name.length == 0)
        throw new Error("Command is missing name\nA command must have a name!\nusage: createCommand('name', [parameters, hooks])");
      return createExecutable(name, Executable.Command, parameters, hooks);
    },
    createQuery: function(name, parameters, hooks){
      if(name == null || name.length == 0)
        throw new Error("Query is missing name\nA query must have a name!\nusage: createQuery('name', [parameters, hooks])");
      return createExecutable(name, Executable.Query, parameters, hooks);
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