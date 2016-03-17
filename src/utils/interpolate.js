define(function(){
  return function interpolate(message, attributes, value, name, path){
    return message.replace(/\{([^}]+)\}/g, function(match, key){
      if(key == "value") return value;
      if(key == "this.name") return name;
      if(key == "this.path") return path;
      if(key in attributes) return attributes[key];
      return match;
    });
  };
});
