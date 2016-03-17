describe("findField", [
  "qvc/validation/validation",
  "knockout"
], function(
  validation,
  ko
){
  it("should return the observable when at the root", function(){
    var obs = ko.observable(2);
    expect(validation.findField("field", {field: obs})).toBe(obs);
  });

  it("should return the observable when nested", function(){
    var obs = ko.observable(2);
    expect(validation.findField("object.field", {object: {field: obs}})).toBe(obs);
  });

  it("should return the observable when nested inside an observable", function(){
    var obs = ko.observable(2);
    expect(validation.findField("object.field", {object: ko.computed(function(){ return {field: obs}})})).toBe(obs);
  });

  it("should throw when not at the root", function(){
    var obs = ko.observable(2);
    expect(function(){
      validation.findField("nonfield", {field: obs}, "SomeExecutable", "unknown field")
    }).toThrow(new Error('unknown field: nonfield\nnonfield is not a member of SomeExecutable\nSomeExecutable = `{"field":2}`'));
  });

  it("should throw when not nested", function(){
    var obs = ko.observable(2);
    expect(function(){
      validation.findField("object.nonfield", {object: {field: obs}}, "SomeExecutable", "unknown field")
    }).toThrow(new Error('unknown field: object.nonfield\nnonfield is not a member of SomeExecutable.object\nSomeExecutable.object = `{"field":2}`'));
  });

  it("should throw when not nested", function(){
    var obs = ko.observable(2);
    expect(function(){
      validation.findField("nonobject.field", {object: {field: obs}}, "SomeExecutable", "unknown field")
    }).toThrow(new Error('unknown field: nonobject.field\nnonobject is not a member of SomeExecutable\nSomeExecutable = `{"object":{"field":2}}`'));
  });

  it("should thow when not nested inside an observable", function(){
    var obs = ko.observable(2);
    expect(function(){
      validation.findField("object.nonfield", {object: ko.computed(function(){ return {field: obs}})}, "SomeExecutable", "unknown field")
    }).toThrow(new Error('unknown field: object.nonfield\nnonfield is not a member of SomeExecutable.object\nSomeExecutable.object = `{"field":2}`'));
  });

  it("should thow when not nested inside an observable", function(){
    var obs = ko.observable(2);
    expect(function(){
      validation.findField("nonobject.field", {object: ko.computed(function(){ return {field: obs}})}, "SomeExecutable", "unknown field")
    }).toThrow(new Error('unknown field: nonobject.field\nnonobject is not a member of SomeExecutable\nSomeExecutable = `{"object":{"field":2}}`'));
  });
});