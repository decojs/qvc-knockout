describe("when calling inheritsFrom", [
  "qvc/utils/inheritsFrom"
], function(
  inheritsFrom
){

  function MyObject() {}

  it("should return an object which is an instance of the passed in argument", function(){
    expect(inheritsFrom(MyObject)).toBeA(MyObject);
  });
});