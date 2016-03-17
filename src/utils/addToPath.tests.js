describe("addToPath", ["qvc/utils/addToPath"], function(addToPath){
  describe("when the path ends with a slash", function(){
    it("should not add a slash", function(){
      expect(addToPath("/absolute/path/to/", "something")).toBe("/absolute/path/to/something");
    });
  });

  describe("when the path does not end with a slash", function(){
    it("should add a slash", function(){
      expect(addToPath("/absolute/path/to", "something")).toBe("/absolute/path/to/something");
    });
  });

  describe("when adding several segments", function(){
    it("should add a slash between each segment", function(){
      expect(addToPath("/absolute/path/to", "something", "deeper", "than", "deep")).toBe("/absolute/path/to/something/deeper/than/deep");
    });
  });
});