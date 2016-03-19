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

    it('should have a onSuccess callback', function(){
      expect(makeHooks().onSuccess).toBeA(Function);
    });

    it('should have a onInvalid callback', function(){
      expect(makeHooks().onInvalid).toBeA(Function);
    });

    it('should have a onError callback', function(){
      expect(makeHooks().onError).toBeA(Function);
    });

    it('should have a onComplete callback', function(){
      expect(makeHooks().onComplete).toBeA(Function);
    });
  });

  describe('when called with an empty object with the callback for', function(){
    var spy = sinon.spy();
    it('beforeExecute should have that beforeExecute callback', function(){
      expect(makeHooks({beforeExecute: spy}).beforeExecute).toBe(spy);
    });

    it('canExecute should have that canExecute callback', function(){
      expect(makeHooks({canExecute: spy}).canExecute).toBe(spy);
    });

    it('onSuccess should have that onSuccess callback', function(){
      expect(makeHooks({onSuccess: spy}).onSuccess).toBe(spy);
    });

    it('onInvalid should have that onInvalid callback', function(){
      expect(makeHooks({onInvalid: spy}).onInvalid).toBe(spy);
    });

    it('onError should have that onError callback', function(){
      expect(makeHooks({onError: spy}).onError).toBe(spy);
    });

    it('onComplete should have that onComplete callback', function(){
      expect(makeHooks({onComplete: spy}).onComplete).toBe(spy);
    });
  });
});