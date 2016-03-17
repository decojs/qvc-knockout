describe("Validatable", [
  "knockout",
  "qvc/validation/Validatable",
  "qvc/koExtensions"
], function(
  ko,
  Validatable
){

  var validatable,
    parameters;

  describe("when using the same validator twice", function(){
    beforeEach(function(){
      parameters = {
        name: ko.observable("deco")
      }
      validatable = new Validatable("FirstCommand", parameters);
    });

    it("should throw an exception", function(){
      expect(function(){
        new Validatable("SecondCommand", parameters);
      }).toThrow(new Error("Observable `name` is parameter `name` in FirstCommand and therefore cannot be a parameter in SecondCommand!"));
    });
  });
});