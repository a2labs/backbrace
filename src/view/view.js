var TAG_REGEX = /^<([a-z][a-z0-9]*)[^>]*>(.*?)<\/\1>$/i;
backbrace.View = Backbone.View.extend( {
  // DOM manipulation should be limited to the scope of the view
  // So let's remove the need for global jQuery/$ access
  $ : function ( selector ) {
    if ( typeof selector !== "string" || TAG_REGEX.test( selector ) ) {
      return Backbone.$( selector );
    }
    return this.$el.find( selector );
  },

  // Similar idea to what backbone.marionette does, but tweaked.
  // This provides base "toJSON()" behavior for any view to call
  // for default-approach binding of model data to template, etc.
  dataToJSON : function () {
    var data = {};
    if ( this.model ) {
      data = this.model.toJSON();
    }
    if ( this.collection ) {
      _.extend(data, { items : this.collection.toJSON() });
    }
    return data;
  }
});