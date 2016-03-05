define([
  "qvc/Executable",
  "qvc/ExecutableResult",
  "qvc/utils",
  "qvc/ajax",
  "qvc/ConstraintResolver",
  "qvc/errorHandler",
  "knockout",
  "qvc/koExtensions"],
  function(
    Executable,
    ExecutableResult,
    utils,
    ajax,
    ConstraintResolver,
    errorHandler,
    ko){

  function QVC(){

    var qvc = this;

    this.constraintResolver = new ConstraintResolver(qvc);

    this.execute = function(executable){
      var parameters = ko.toJS(executable.parameters);
      var data = {
        parameters: JSON.stringify(parameters),
        csrfToken: qvc.config.csrf
      };
      var url = ajax.addToPath(qvc.config.baseUrl, executable.type + "/" + executable.name);
      return ajax(url, data, "POST")
      .then(function (responseText) {
        return new ExecutableResult(JSON.parse(responseText || "{}"));
      }, function(responseText){
        return new ExecutableResult({exception: {message: responseText}});
      });
    };

    this.loadConstraints = function(name){
      var url = ajax.addToPath(qvc.config.baseUrl, "constraints/" + name);
      return ajax(ajax.addParamToUrl(url, 'cacheKey', qvc.config.cacheKey), null, "GET")
      .then(function(responseText){
        try{
          var response = JSON.parse(responseText || "{\"parameters\":[]}");
          return response.parameters || [];
        }catch(e){
          return [];
        }
      }, function(responseText){
        return [];
      });
    };


    this.config = {
      baseUrl: "/qvc",
      csrf: "",
      cachekey: Date.now()
    }
  };

  var qvc = new QVC();

  function createExecutable(name, type, parameters, callbacks){
    var executable = new Executable(name, type, parameters || {}, callbacks || {}, qvc);
    var execute = executable.execute.bind(executable);
    execute.isValid = ko.computed(executable.isValid, executable);
    execute.isBusy = ko.computed(executable.isBusy, executable);
    execute.hasError = ko.computed(executable.hasError, executable);
    execute.success = function(callback){
      executable.hooks.success = callback;
      return execute;
    };
    execute.error = function(callback){
      executable.hooks.error = callback;
      return execute;
    };
    execute.invalid = function(callback){
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
    execute.complete = function(callback){
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
      utils.extend(qvc.config, config);
    }
  }
});