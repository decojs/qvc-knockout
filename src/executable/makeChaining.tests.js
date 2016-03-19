describe('makeChaining', [
  'qvc/executable/makeChaining'
], function(
  makeChaining
){
  describe('when called for a command', function(){
    beforeEach(function(){
      this.chainable = {};
      this.hooks = {};
      makeChaining(this.chainable, this.hooks, 'command');
    });

    it('should add the beforeExecute callback', function(){
      expect(this.chainable.beforeExecute).toBeA(Function);
    });

    it('should add the canExecute callback', function(){
      expect(this.chainable.canExecute).toBeA(Function);
    });

    it('should add the onSuccess callback', function(){
      expect(this.chainable.onSuccess).toBeA(Function);
    });

    it('should add the onInvalid callback', function(){
      expect(this.chainable.onInvalid).toBeA(Function);
    });

    it('should add the onError callback', function(){
      expect(this.chainable.onError).toBeA(Function);
    });

    it('should not add the result callback', function(){
      expect(this.chainable.result).not.toBeDefined();
    });

    it('should add the onComplete callback', function(){
      expect(this.chainable.onComplete).toBeA(Function);
    });
  });

  describe('when called for a query', function(){
    beforeEach(function(){
      this.chainable = {};
      this.hooks = {};
      makeChaining(this.chainable, this.hooks, 'query');
    });

    it('should add the beforeExecute callback', function(){
      expect(this.chainable.beforeExecute).toBeA(Function);
    });

    it('should add the canExecute callback', function(){
      expect(this.chainable.canExecute).toBeA(Function);
    });

    it('should add the onSuccess callback', function(){
      expect(this.chainable.onSuccess).toBeA(Function);
    });

    it('should add the onInvalid callback', function(){
      expect(this.chainable.onInvalid).toBeA(Function);
    });

    it('should add the onError callback', function(){
      expect(this.chainable.onError).toBeA(Function);
    });

    it('should add the result callback', function(){
      expect(this.chainable.result).toBeA(Function);
    });

    it('should add the onComplete callback', function(){
      expect(this.chainable.onComplete).toBeA(Function);
    });
  });
});