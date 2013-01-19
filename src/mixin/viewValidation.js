var viewValidation = backbrace.viewValidation = {
  getValidationTarget : function() {
    return '.validation';
  },

  showValidation : function ( model, errors ) {
    var target;
    if ( target = this.getValidationTarget() ) {
      _.each( errors, function ( error, name ) {
        this.$( "[name='" + name + "']" )
          .closest( target )
          .addClass( 'error' );
      }, this );
    }
  },

  useValidatedModel : function ( model ) {
    if ( this.model && this.model !== model ) {
      this.model.off( 'error', this.showValidation, this );
    }
    this.model = model;
    this.model.on( 'error', this.showValidation, this );
  }
};