var modelValidationMixin = backbrace.modelValidationMixin = {
  validate : function (attributes) {
    if(this.rules) {
      var targetState = _.extend(this.toJSON(), attributes);
      this.set("_errors", {}, { silent: true });
      var errors = {};
      _.each(attributes, function (value, key) {
        if(this.rules[key]){
          var val = $.trim(value);
          var idx = 0;
          var pass;
          for(; idx < this.rules[key].length; idx++) {
            (function(rule){
              rule = rule.predicate ? rule : { predicate: rule, errorMsg: "The 'key' has validation errors." };
              pass = rule.predicate.call(this, val, targetState);
              var msg = rule.errorMsg;
              if(Object.prototype.toString.call(pass) === '[object String]') {
                msg = pass || rule.errorMsg;
                pass = !pass; // if we got a string back, it's an error message, so the field failed the predicate
              }
              if (!pass) {
                if(!errors[key]) {
                  errors[key] = [];
                }
                errors[key].push(msg);
              }
            })(this.rules[key][idx]);
            if(!pass && this.rules[key][idx].stopIfBroken) {
              break;
            }
          }
        }
      }, this);
      this.set("_errors", errors, { silent: true });
      // Return only when errors exist.
      if (!_.isEmpty(errors)) {
        return errors;
      }
    }
  },
  hasErrors : function() {
    return !_.isEmpty(this.get("_errors"));
  }
};