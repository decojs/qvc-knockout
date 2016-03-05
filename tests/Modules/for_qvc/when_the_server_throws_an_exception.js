describe("when the server throws an exception", {
  "qvc/ajax":"Mocks/ajaxMock",
  "qvc/errorHandler":"Mocks/errorHandlerMock"
},[
  "qvc",
  "qvc/ajax",
  "qvc/errorHandler",
  "knockout"
], function(
  qvc,
  ajaxMock,
  errorHandler,
  ko
){

  var executable,
      parameters;


  afterEach(function(){
    ajaxMock.reset();
    errorHandler.reset();
  });

  xdescribe("fetching constraints and the server responds with a 200 status code", function(){

    beforeEach(function(){
      ajaxMock.responseText = JSON.stringify({exception:{message:"oh noes!"}});
      executable = qvc.createQuery("name"+Math.random());
    });

    it("should call the errorHandler", function(){
      expect(errorHandler.onError).toHaveBeenCalledWith("oh noes!");
    });
  });

  xdescribe("fetching constraints and the server responds with a 500 status code", function(){

    beforeEach(function(){
      ajaxMock.responseCode = 500;
      ajaxMock.responseText = "oh noes!";
      executable = qvc.createQuery("name"+Math.random());
    });

    it("should call the errorHandler", function(){
      expect(errorHandler.onError).toHaveBeenCalledWith("oh noes!");
    });
  });

  describe("executing", function(){

    beforeEach(function(){
      executable = qvc.createQuery("name"+Math.random());

    });

    describe("executing the and the server responds with a 200 status code", function(){

      beforeEach(function(){
        ajaxMock.spy.reset();
        ajaxMock.responseText = JSON.stringify({success:false, exception:{message:"oh noes!"}});

        because: {
            executable();
        }
      });

      it("should call the errorHandler", function(){
        expect(errorHandler.onError).toHaveBeenCalledWith("oh noes!");
      });
    });

    describe("when executing, and the server responds with a 500 status code", function(){

      beforeEach(function(){
        ajaxMock.spy.reset();
        ajaxMock.responseCode = 500;
        ajaxMock.responseText = "oh noes!";

        because: {
            executable();
        }
      });

      it("should call the errorHandler", function(){
        expect(errorHandler.onError).toHaveBeenCalledWith("oh noes!");
      });
    });
  });
});