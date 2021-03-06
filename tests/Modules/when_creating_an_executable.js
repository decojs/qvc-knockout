describe("when creating an executable", {
  "qvc/utils/ajax":"Mocks/ajaxMock"
},["qvc", "qvc/utils/ajax", "knockout", "Given/deferred"], function(qvc, ajaxMock, ko, deferred){

  var executable,
    parameters;

  beforeEach(function(){
    ajaxMock.responseText = "{\"parameters\": []}";
    executable = qvc.createQuery("name"+Math.random());
  });

  afterEach(function(){
    ajaxMock.spy.reset();
  });

  it("should expose the validator", function(){
    expect(executable.validator).toBeDefined();
  });

  describe("and setting the onSuccess callback", function(){

    var spy,
      successResult;

    beforeEach(function(){
      ajaxMock.spy.reset();
      ajaxMock.responseText = JSON.stringify({success:true});
      spy = deferred();

      because: {
        successResult = executable.onSuccess(spy.resolve);
        executable();
      }
    });

    it("should return the executable", function(){
      expect(successResult).toBe(executable);
    });

    it("should call the onSuccess callback on success", function(done){
      spy.then(done);
    });

  });

  describe("and setting the onError callback", function(){

    var spy,
      errorResult;

    beforeEach(function(){
      ajaxMock.spy.reset();
      ajaxMock.responseText = JSON.stringify({success:false, valid:true});
      spy = deferred();

      because: {
        errorResult = executable.onError(spy.resolve);
        executable();
      }
    });

    it("should return the executable", function(){
      expect(errorResult).toBe(executable);
    });

    it("should call the onError callback on error", function(done){
      spy.then(done);
    });
  });

  describe("and setting the beforeExecute callback", function(){

    var spy,
      beforeExecuteResult;

    beforeEach(function(){
      ajaxMock.spy.reset();
      ajaxMock.responseText = JSON.stringify({success:false});
      spy = sinon.spy();

      because: {
        beforeExecuteResult = executable.beforeExecute(spy);
        executable();
      }
    });

    it("should return the executable", function(){
      expect(beforeExecuteResult).toBe(executable);
    });

    it("should call the beforeExecute callback on beforeExecute", function(){
      expect(spy.callCount).toBe(1);
    });
  });

  describe("and setting the canExecute callback", function(){

    var spy,
      canExecuteResult;

    beforeEach(function(){
      ajaxMock.spy.reset();
      ajaxMock.responseText = JSON.stringify({success:false});
      spy = sinon.spy();

      because: {
        canExecuteResult = executable.canExecute(spy);
        executable();
      }
    });

    it("should return the executable", function(){
      expect(canExecuteResult).toBe(executable);
    });

    it("should call the canExecute callback on canExecute", function(){
      expect(spy.callCount).toBe(1);
    });
  });

  describe("and setting the result callback", function(){

    var spy,
      resultResult;

    beforeEach(function(){
      ajaxMock.spy.reset();
      ajaxMock.responseText = JSON.stringify({success:true, result:"something"});
      spy = deferred();

      because: {
        resultResult = executable.result(spy.resolve);
        executable();
      }
    });

    it("should return the executable", function(){
      expect(resultResult).toBe(executable);
    });

    it("should call the result callback on result", function(done){
      spy.then(done);
    });
  });

  describe("and setting the onComplete callback", function(){

    var spy,
      completeResult;

    beforeEach(function(){
      ajaxMock.spy.reset();
      ajaxMock.responseText = JSON.stringify({success:true});
      spy = deferred();

      because: {
        completeResult = executable.onComplete(spy.resolve);
        executable();
      }
    });

    it("should return the executable", function(){
      expect(completeResult).toBe(executable);
    });

    it("should call the onComplete callback on complete", function(done){
      spy.then(done);
    });
  });
});