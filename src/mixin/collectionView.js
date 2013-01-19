var collectionViewMixin = backbrace.collectionViewMixin = collectionView = {
  _postInit : function () {
    this.childViews = {};
    if(this.collection) {
      this.collection.on("reset",  this.render,      this);
      this.collection.on("add",    this.addChild,    this);
      this.collection.on("remove", this.removeChild, this);
    }
  },

  mixin: {
    getViewConstructor : function (model) {
      var viewType = this.options.viewType || this.viewType;
      if (!viewType) {
        throw new Error("A `viewType` must be specified");
      }
      return viewType;
    },

    // Initializes view for each model within the collection.
    addChild : function (model) {
      var index = this.collection.indexOf(model);
      var ViewCtor = this.getViewConstructor(model);
      var viewInstance = new ViewCtor({ model: model });
      this.childViews[model.cid] = viewInstance;
      this.renderChild(viewInstance, index);
    },

    renderChild: function(view, index) {
      view.render();
      this.$el.append(view.$el);
    },

    removeChild : function (model) {
      if (this.childViews[model.cid]) {
        this.childViews[model.cid].remove();
        delete this.childViews[model.cid];
      }
    },

    removeChildView: function(item) {
      this.removeChild(item.model);
    },

    removeAllChildren: function() {
      _.each(this.childViews, this.removeChildView, this);
    },

    remove : function () {
      this.removeAllChildren();
      this.undelegateEvents();
      this.$el.remove();
      return this;
    },

    render: function(context) {
      this.trigger('preRender', context);
      this.removeAllChildren();
      this.collection.forEach(function(item){
        this.addChild(item);
      }, this);
      this.trigger('rendered', context);
    }
  }
};