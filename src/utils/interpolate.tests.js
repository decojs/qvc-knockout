describe("interpolate", [
  "qvc/utils/interpolate"
], function(
  interpolate
){
  describe("with the value", function(){
    it("should interpolate the value into the message", function(){
      expect(interpolate("test {value}", {}, "a value")).toBe("test a value");
    });
  });

  describe("with an attribute", function(){
    it("should interpolate the value into the message", function(){
      expect(interpolate("test {attr}", {attr:"an attribute"})).toBe("test an attribute");
    });
  });
  describe("with multiple attributes", function(){
    it("should interpolate the value into the message", function(){
      expect(interpolate("{value} is not between {min} and {max}", {min:1, max:10}, 17)).toBe("17 is not between 1 and 10");
    });
  });

  describe("with a value containing curly braces", function(){
    it("should interpolate the value into the message without messing up curly braces", function(){
      expect(interpolate("test {value}", {attr:"an attribute"}, "a {attr}")).toBe("test a {attr}");
    });
  });

  describe("with the name of the field", function(){
    it("should interpolate the name into the message", function(){
      expect(interpolate("test {this.name}", {}, "a value", "a name", "a path")).toBe("test a name");
    });
  });

  describe("with the path to the field", function(){
    it("should interpolate the path into the message", function(){
      expect(interpolate("test {this.path}", {}, "a value", "a name", "a path")).toBe("test a path");
    });
  });

  describe("with a missing value", function(){
    it("should interpolate the value into the message", function(){
      expect(interpolate("test {unexisting}", {attr:"an attribute"}, "a value")).toBe("test {unexisting}");
    });
  });


});