(function ( root, factory ) {
  if ( typeof module === "object" && module.exports ) {
    // Node, or CommonJS-Like environments
    module.exports = function(_, Backbone, riveter, postal) {
      return factory( _, Backbone, riveter, postal );
    }
  } else if ( typeof define === "function" && define.amd ) {
    // AMD. Register as an anonymous module.
    define( ["underscore", "backbone", "riveter", "postal"], function ( _, backbone, riveter, postal ) {
      return factory( _, backbone, riveter, postal, root );
    } );
  } else {
    // Browser globals
    root.backbrace = factory( root._, root.Backbone, root.riveter, root.postal, root );
  }
}( window || this, function ( _, Backbone, riveter, postal, root, undefined ) {

  var backbrace = root.backbrace || {};

  // import("./view/view.js")
  // import("./model/model.js")
  // import("./mixin/messaging.js")
  // import("./mixin/modelValidation.js")
  // import("./mixin/viewValidation.js")
  // import("./mixin/collectionView.js")

  riveter( backbrace.View );
  riveter( backbrace.Model );

  backbrace.View = backbrace.View.compose( messagingMixin, viewValidation );
  backbrace.CollectionView = backbrace.View.compose( collectionViewMixin );
  backbrace.Model = backbrace.Model.compose( messagingMixin, modelValidationMixin );

  return backbrace;

} ));