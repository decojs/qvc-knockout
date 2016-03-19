describe('makeHooks', ['qvc/executable/makeHooks'], function(makeHooks){
  it('should return an object when called with zero elements', function(){
    expect(makeHooks()).toBeDefined();
  });

  describe('when called with an empty object', function(){
    it('should have a beforeExecute callback', function(){
      expect(makeHooks().beforeExecute).toBeA(Function);
    });

    it('should have a canExecute callback', function(){
      expect(makeHooks().canExecute).toBeA(Function);
    });

    it('should have a canExecute callback that returns true', function(){
      expect(makeHooks().canExecute()).toBe(true);
    });

    it('should have a success callback', function(){
      expect(makeHooks().success).toBeA(Function);
    });

    it('should have a invalid callback', function(){
      expect(makeHooks().invalid).toBeA(Function);
    });

    it('should have a error callback', function(){
      expect(makeHooks().error).toBeA(Function);
    });

    it('should have a complete callback', function(){
      expect(makeHooks().complete).toBeA(Function);
    });

  describe('when called with an empty object with the callback for', function(){
    var spy = sinon.spy();
    it('beforeExecute should have that beforeExecute callback', function(){
      expect(makeHooks({beforeExecute: spy}).beforeExecute).toBe(spy);
    });

    it('canExecute should have that canExecute callback', function(){
      expect(makeHooks({canExecute: spy}).canExecute).toBe(spy);
    });

    it('success should have that success callback', function(){
      expect(makeHooks({success: spy}).success).toBe(spy);
    });

    it('invalid should have that invalid callback', function(){
      expect(makeHooks({invalid: spy}).invalid).toBe(spy);
    });

    it('error should have that error callback', function(){
      expect(makeHooks({error: spy}).error).toBe(spy);
    });

    it('complete should have that complete callback', function(){
      expect(makeHooks({complete: spy}).complete).toBe(spy);
    });
  });
});