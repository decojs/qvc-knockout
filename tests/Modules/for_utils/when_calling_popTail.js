describe("when calling popTail", [
  "qvc/utils"
], function(
  utils
){

  it("should return a list without the last item", function(){
    expect(utils.popTail([1, 2, 3])).toEqual([1, 2]);
  });
});