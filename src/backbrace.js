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
}( this, function ( _, Backbone, riveter, postal, root, undefined ) {

  var backbrace = root.backbrace || {};

  // import("view.js")
  // import("messagingMixin.js")

  riveter( backbrace.View );

  backbrace.View = backbrace.View.compose( messagingMixin );

  return backbrace;

} ));