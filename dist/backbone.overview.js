"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Overview = exports.OrderedListView = void 0;

var _lodash = require("lodash");

/*!
 * Backbone.Overview
 *
 * Copyright (c) JC Brand <jc@opkode.com>
 * Licensed under the Mozilla Public License (MPL)
 */
var View = Backbone.NativeView === undefined ? Backbone.View : Backbone.NativeView;

var Overview = Backbone.Overview = function (options) {
  var _this = this;

  /* An Overview is a View that contains and keeps track of sub-views.
  * Kind of like what a Collection is to a Model.
  */
  this.views = {};

  this.keys = function () {
    return Object.keys(_this.views);
  };

  this.getAll = function () {
    return _this.views;
  };

  this.get = function (id) {
    return _this.views[id];
  };
  /* Exclusive get. Returns all instances except the given id. */


  this.xget = function (id) {
    return _this.keys().filter(function (k) {
      return k !== id;
    }).reduce(function (acc, k) {
      acc[k] = _this.views[k];
      return acc;
    }, {});
  };

  this.add = function (id, view) {
    _this.views[id] = view;
    return view;
  };

  this.remove = function (id) {
    if (typeof id === "undefined") {
      new View().remove.apply(_this);
    }

    var view = _this.views[id];

    if (view) {
      delete _this.views[id];
      view.remove();
      return view;
    }
  };

  this.removeAll = function () {
    _this.keys().forEach(function (id) {
      return _this.remove(id);
    });

    return _this;
  };

  View.apply(this, Array.prototype.slice.apply(arguments));
};

exports.Overview = Overview;
var methods = {
  chain: _lodash.chain,
  includes: _lodash.includes,
  difference: _lodash.difference,
  drop: _lodash.drop,
  every: _lodash.every,
  filter: _lodash.filter,
  find: _lodash.find,
  first: _lodash.first,
  forEach: _lodash.forEach,
  head: _lodash.head,
  indexOf: _lodash.indexOf,
  initial: _lodash.initial,
  invoke: _lodash.invoke,
  isEmpty: _lodash.isEmpty,
  last: _lodash.last,
  lastIndexOf: _lodash.lastIndexOf,
  map: _lodash.map,
  max: _lodash.max,
  min: _lodash.min,
  reduce: _lodash.reduce,
  reduceRight: _lodash.reduceRight,
  reject: _lodash.reject,
  rest: _lodash.rest,
  sample: _lodash.sample,
  shuffle: _lodash.shuffle,
  size: _lodash.size,
  some: _lodash.some,
  sortBy: _lodash.sortBy,
  tail: _lodash.tail,
  take: _lodash.take,
  toArray: _lodash.toArray,
  without: _lodash.without
};
Object.keys(methods).forEach(function (name) {
  Overview.prototype[name] = function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this.views);
    return methods[name].apply(this, args);
  };
});
(0, _lodash.extend)(Overview.prototype, View.prototype);
Overview.extend = View.extend;
var OrderedListView = Backbone.OrderedListView = Backbone.Overview.extend({
  /* An OrderedListView is a special type of Overview which adds some
   * methods and conventions for rendering an ordered list of elements.
   */
  // The `listItems` attribute denotes the path (from this View) to the
  // list of items.
  listItems: 'model',
  // The `sortEvent` attribute specifies the event which should cause the
  // ordered list to be sorted.
  sortEvent: 'change',
  // The `listSelector` is the selector used to query for the DOM list
  // element which contains the ordered items.
  listSelector: '.ordered-items',
  // The `itemView` is constructor which should be called to create a
  // View for a new item.
  ItemView: undefined,
  // The `subviewIndex` is the attribute of the list element model which
  // acts as the index of the subview in the overview.
  // An overview is a "Collection" of views, and they can be retrieved
  // via an index. By default this is the 'id' attribute, but it could be
  // set to something else.
  subviewIndex: 'id',
  initialize: function initialize() {
    this.sortEventually = (0, _lodash.debounce)(this.sortAndPositionAllItems.bind(this), 250);
    this.items = (0, _lodash.get)(this, this.listItems);
    this.items.on('add', this.sortEventually, this);
    this.items.on('remove', this.removeView, this);
    this.items.on('reset', this.removeAll, this);

    if (this.sortEvent) {
      this.items.on(this.sortEvent, this.sortEventually, this);
    }
  },
  createItemView: function createItemView(item) {
    var item_view = this.get(item.get(this.subviewIndex));

    if (!item_view) {
      item_view = new this.ItemView({
        model: item
      });
      this.add(item.get(this.subviewIndex), item_view);
    } else {
      item_view.model = item;
      item_view.initialize();
    }

    item_view.render();
    return item_view;
  },
  removeView: function removeView(item) {
    this.remove(item.get(this.subviewIndex));
  },
  sortAndPositionAllItems: function sortAndPositionAllItems() {
    var _this2 = this;

    if (!this.items.length) {
      return;
    }

    this.items.sort();
    var list_el = this.el.querySelector(this.listSelector);
    var div = document.createElement('div');
    list_el.parentNode.replaceChild(div, list_el);
    this.items.forEach(function (item) {
      var view = _this2.get(item.get(_this2.subviewIndex));

      if (!view) {
        view = _this2.createItemView(item);
      }

      list_el.insertAdjacentElement('beforeend', view.el);
    });
    div.parentNode.replaceChild(list_el, div);
  }
});
exports.OrderedListView = OrderedListView;

//# sourceMappingURL=backbone.overview.js.map