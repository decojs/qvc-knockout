describe("when creating an executable", {
  "qvc/ajax":"Mocks/ajaxMock"
},["qvc", "qvc/ajax", "knockout"], function(qvc, ajaxMock, ko){

  var executable,
    parameters;
  
  beforeEach(function(){
    ajaxMock.responseText = "{\"parameters\": []}";
    executable = qvc.createCommand("name"+Math.random());
  });

  afterEach(function(){
    ajaxMock.spy.reset();
  });
  
  it("should have isValid", function(){
    expect(executable.isValid).toBeDefined();
    expect(executable.isValid()).toBe(true);
  });
  
  it("should have hasError", function(){
    expect(executable.hasError).toBeDefined();
    expect(executable.hasError()).toBe(false);
  });
  
  it("should have isBusy", function(){
    expect(executable.isBusy).toBeDefined();
    expect(executable.isBusy()).toBe(false);
  });
  
  it("should have result", function(){
    expect(executable.result).toBeDefined();
    expect(executable.result()).toBe(null);
  });
  
  it("should have way to set the beforeExecute hook", function(){
    expect(executable.beforeExecute).toBeDefined();
  });
  
  it("should have way to set the canExecute hook", function(){
    expect(executable.canExecute).toBeDefined();
  });
  
  it("should have way to set the success hook", function(){
    expect(executable.success).toBeDefined();
  });
  
  it("should have way to set the invalid hook", function(){
    expect(executable.invalid).toBeDefined();
  });
  
  it("should have way to set the complete hook", function(){
    expect(executable.complete).toBeDefined();
  });
  
  it("should have way to set the error hook", function(){
    expect(executable.error).toBeDefined();
  });
  
  it("should have a way to clear validation messages", function(){
    expect(executable.clearValidationMessages).toBeDefined();
  });
  
  it("should have a way to manually run validation", function(){
    expect(executable.validate).toBeDefined();
  });
  
  describe("when the name is missing", function(){
    it("should throw an error", function(){
      expect(function(){
        qvc.createCommand();
      }).toThrow(new Error("Command is missing name\nA command must have a name!\nusage: createCommand('name', [parameters, hooks])"));
    });
    it("should throw an error", function(){
      expect(function(){
        qvc.createQuery();
      }).toThrow(new Error("Query is missing name\nA query must have a name!\nusage: createQuery('name', [parameters, hooks])"));
    });
  });
  
  describe("with observable parameters", function(){
  
    beforeEach(function(){
      parameters = {
        name: ko.observable()
      };
      ajaxMock.spy.reset();
      executable = qvc.createCommand("name"+Math.random(), parameters);
    });

    afterEach(function(){
      ajaxMock.spy.reset();
    });
  
    it("should add validator to the parameters", function(){
      expect(parameters.name.validator).toBeDefined()
    });

    it("should request constraints from the server", function(){
      expect(ajaxMock.spy.callCount).toBe(1);
      expect(ajaxMock.spy.firstCall.args[0]).toMatch(/constraints\/name/);
    });
  });
  
});