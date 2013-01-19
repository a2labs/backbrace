var messagingMixin = backbrace.messagingMixin = {
  _preInit: function(attributes, options) {
    options = (this instanceof Backbone.View ? attributes : options) || {};
    this.subscriptions = _.extend({}, this.subscriptions, options.subscriptions);
    this.publications = _.extend({}, this.publications, options.publications);
    this.messaging = this.messaging || {};
    this.configureMessaging();
  },
  mixin: {
    configureMessaging: function() {
      this.setupSubscriptions();
      this.bridgeEvents();
    },

    bridgeEvents: function() {
      this.unbridgeEvents();
      if (!_.isEmpty(this.publications)) {
        _.each(this.publications, function(publication, evnt) {
          var _publication = publication;

          if (!this.messaging.publications[evnt]) {
            this.messaging.publications[evnt] = {};
          }

          if (!_.isObject(publication)) {
            _publication = {};
            _publication[publication] = _.identity;
          }

          _.each(_publication, function(accessor, pub) {
            var meta = pub.split(' ');
            var channel = meta[0];
            var topic = meta[1];
            var listener = function() {
              var args = Array.prototype.slice.call(arguments, 0);
              var data = accessor.apply(this, args);
              postal.publish({
                channel: channel,
                topic: topic,
                data: data || {}
              });
            };

            this.on(evnt, listener, this);
            this.messaging.publications[evnt][pub] = _.bind(function() {
              this.off(evnt, listener);
            }, this);
          }, this);
        }, this);
      }
    },

    unbridgeEvents: function() {
      if (this.messaging.publications) {
        _.each(this.messaging.publications, function(publication) {
          _.each(publication, function(pub) {
            while (pub.length) {
              pub.pop()();
            }
          });
        });
      }

      this.messaging.publications = {};
    },

    setupSubscriptions: function() {
      this.unwindSubscriptions();
      if (!_.isEmpty(this.subscriptions)) {
        _.each(this.subscriptions, function(sub, handler) {
          sub = _.isArray(sub) ? sub : [sub];
          _.each(sub, function(subscription) {
            var meta = subscription.split(' ');
            var channel = meta[0];
            var topic = meta[1];
            // TODO: After adding app.warn, perhaps consider warning if handler/channel are not present...
            if (this[handler]) {
              this.messaging.subscriptions[subscription] = postal.subscribe({
                channel: channel,
                topic: topic,
                callback: this[handler]
              }).withContext(this);
            }
          }, this);
        }, this);
      }
    },

    unwindSubscriptions: function() {
      if (this.messaging.subscriptions) {
        _.each(this.messaging.subscriptions, function(sub) {
          sub.unsubscribe();
        });
      }

      this.messaging.subscriptions = {};
    }
  }
};