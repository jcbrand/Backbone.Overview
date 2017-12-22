/*!
 * Backbone.Overview 
 *
 * Copyright (c) 2017, JC Brand <jc@opkode.com>
 * Licensed under the Mozilla Public License (MPL) 
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(["underscore", "backbone"], factory);
  } else {
    // RequireJS isn't being used.
    // Assume underscore and backbone are loaded in <script> tags
    factory(_ || root._, Backbone || root.Backbone);
  }
})(this, function (_, Backbone) {
  "use strict";

  var Overview = Backbone.Overview = function (options) {
    /* An Overview is a View that contains and keeps track of sub-views.
     * Kind of like what a Collection is to a Model.
     */
    var that = this;
    this.views = {};
    this.keys = _.partial(_.keys, this.views);
    this.getAll = _.partial(_.identity, this.views);

    this.get = function (id) {
      return that.views[id];
    };

    this.xget = function (id) {
      /* Exclusive get. Returns all instances except the given id. */
      return _.filter(that.views, function (view, vid) {
        return vid !== id;
      });
    };

    this.add = function (id, view) {
      that.views[id] = view;
      return view;
    };

    this.remove = function (id) {
      if (typeof id === "undefined") {
        new Backbone.View().remove.apply(that);
      }

      var view = that.views[id];

      if (view) {
        delete that.views[id];
        view.remove();
        return view;
      }
    };

    this.removeAll = function () {
      _.each(_.keys(that.views), that.remove);

      return that;
    };

    Backbone.View.apply(this, Array.prototype.slice.apply(arguments));
  };

  var methods = ['all', 'any', 'chain', 'collect', 'contains', 'detect', 'difference', 'drop', 'each', 'every', 'filter', 'find', 'first', 'foldl', 'foldr', 'forEach', 'head', 'include', 'indexOf', 'initial', 'inject', 'invoke', 'isEmpty', 'last', 'lastIndexOf', 'map', 'max', 'min', 'reduce', 'reduceRight', 'reject', 'rest', 'sample', 'select', 'shuffle', 'size', 'some', 'sortBy', 'tail', 'take', 'toArray', 'without']; // Mix in each Underscore method as a proxy to `Overview#view`.

  _.each(methods, function (method) {
    Overview.prototype[method] = function () {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(this.views);
      return _[method].apply(_, args);
    };
  });

  _.extend(Overview.prototype, Backbone.View.prototype);

  Overview.extend = Backbone.View.extend;
  return Backbone.Overview;
});

//# sourceMappingURL=backbone.overview.js.map