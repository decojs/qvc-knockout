describe("when executing", {
  "qvc/utils/ajax":"Mocks/ajaxMock"
},["qvc", "qvc/utils/ajax", "knockout", "Given/deferred"], function(qvc, ajaxMock, ko, deferred){

  var executable,
    beforeExecute,
    canExecute,
    invalidSpy,
    parameters,
    result;

  describe("valid parameters", function(){

    beforeEach(function(){
      beforeExecute = deferred();
      canExecute = deferred();
      invalidSpy = deferred();
      ajaxMock.responseText = "{\"parameters\": []}";
      executable = qvc.createCommand("MyCommand", {}, {
        beforeExecute: beforeExecute.resolve,
        canExecute: canExecute.resolve,
        onInvalid: invalidSpy.resolve
      });
      ajaxMock.spy.reset();
    });

    because(function(){
      ajaxMock.responseText = "{\"success\": true}";
      result = executable();
    });

    it("should return false, so that it can be used in click and submit bindings", function(){
      expect(result).toBe(false);
    });

    it("should call beforeExecute", function(done){
      beforeExecute.then(done);
    });

    it("should check canExecute", function(done){
      canExecute.then(done);
    });

    it("should not call invalid listener", function(done){
      invalidSpy.then(done.fail);
      setTimeout(done, 100);
    });

    it("should AJAX the server", function(){
      expect(ajaxMock.spy).toHaveBeenCalled();
      var args = ajaxMock.spy.firstCall.args;
      expect(args[0]).toMatch(/command\/MyCommand$/);
    });

  });

  describe("after complete", function(){

    var successSpy,
        completeSpy,
        errorSpy

    beforeEach(function(){

      successSpy = deferred();
      completeSpy = deferred();
      errorSpy = deferred();
      invalidSpy = deferred();

      parameters = {
        name: ko.observable()
      }

      ajaxMock.responseText = "{\"parameters\": []}";

      executable = qvc.createCommand(
        "MyCommand",
        parameters,
        {
          onSuccess: successSpy.resolve,
          onComplete: completeSpy.resolve,
          onError: errorSpy.resolve,
          onInvalid: invalidSpy.resolve
        }
      );
      ajaxMock.responseText = "{\"success\":true,\"valid\":true}";
      parameters.name.validator.message("hello");

      result = executable();
    });

    it("should return false, so that it can be used in click and submit bindings", function(){
      expect(result).toBe(false);
    });

    it("should clear validation messages", function(){
      expect(parameters.name.validator.message()).toBe("");
    });

    it("should call success", function(done){
      successSpy.then(done);
    });

    it("should call complete", function(done){
      completeSpy.then(done);
    });

    it("should not call error", function(done){
      errorSpy.then(done.fail);
      setTimeout(done, 100);
      });

    it("should not call invalid", function(done){
      invalidSpy.then(done.fail);
      setTimeout(done, 100);
      });
  });

  describe("invalid parameters", function(){

    var beforeExecute,
        canExecute,
        successSpy,
        completeSpy,
        errorSpy;

    because(function(){
      beforeExecute = deferred();
      canExecute = deferred();
      successSpy = deferred();
      completeSpy = deferred();
      errorSpy = deferred();
      invalidSpy = deferred();

      executable = qvc.createCommand("MyCommand", {}, {
        beforeExecute: beforeExecute.resolve,
        canExecute: canExecute.resolve,
        onInvalid: invalidSpy.resolve,
        onSuccess: successSpy.resolve,
        onComplete: completeSpy.resolve,
        onError: errorSpy.resolve
      });

      executable.validator.validate = function(){
        executable.validator.isValid(false);
      };

      result = executable();
    });

    it("should return false, so that it can be used in click and submit bindings", function(){
      expect(result).toBe(false);
    });

    it("should call beforeExecute", function(done){
      beforeExecute.then(done);
    });

    it("should not call canExecute", function(done){
      canExecute.then(done.fail);
      setTimeout(done, 100);
    });

    it("should call invalid listener", function(done){
      invalidSpy.then(done);
    });

    it("should not call success", function(done){
      successSpy.then(done.fail);
      setTimeout(done, 100);
    });

    it("should not call complete", function(done){
      completeSpy.then(done.fail);
      setTimeout(done, 100);
    });

    it("should not call error", function(done){
      errorSpy.then(done.fail);
      setTimeout(done, 100);
     });

    it("should call invalid", function(done){
      invalidSpy.then(done);
     });
  });

  describe("with invalid result from the server", function(){

    var successSpy,
        completeSpy,
        errorSpy;

    beforeEach(function(){
      successSpy = deferred();
      completeSpy = deferred();
      errorSpy = deferred();
      invalidSpy = deferred();

      parameters = {
        name: ko.observable()
      }

      ajaxMock.responseText = "{\"parameters\": []}";

      executable = qvc.createCommand(
        "MyCommand",
        parameters,
        {
          onSuccess: successSpy.resolve,
          onComplete: completeSpy.resolve,
          onError: errorSpy.resolve,
          onInvalid: invalidSpy.resolve
        }
      );
      ajaxMock.responseText = "{\"success\":false, \"violations\":[{}]}";

      result = executable();
    });

    it("should return false, so that it can be used in click and submit bindings", function(){
      expect(result).toBe(false);
    });

    it("should clear validation messages", function(){
      expect(parameters.name.validator.message()).toBe("");
    });

    it("should not call success", function(done){
      successSpy.then(done.fail);
      setTimeout(done, 100);
    });

    it("should call complete", function(done){
      completeSpy.then(done);
    });

    it("should not call error", function(done){
      errorSpy.then(done.fail);
      setTimeout(done, 100);
     });

    it("should call invalid", function(done){
      invalidSpy.then(done);
     });
  });
});