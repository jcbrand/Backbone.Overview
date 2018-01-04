/*!
 * Backbone.Overview 
 *
 * Copyright (c) 2018, JC Brand <jc@opkode.com>
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
}(this, function (_, Backbone) {
    "use strict";

    const View = _.isUndefined(Backbone.NativeView) ? Backbone.View : Backbone.NativeView;

    const Overview = Backbone.Overview = function (options) {
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
                new View().remove.apply(that);
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
        View.apply(this, Array.prototype.slice.apply(arguments));
    };

    var methods = [
        'all', 'any', 'chain', 'collect', 'contains', 'detect',
        'difference', 'drop', 'each', 'every', 'filter', 'find',
        'first', 'foldl', 'foldr', 'forEach', 'head', 'include',
        'indexOf', 'initial', 'inject', 'invoke', 'isEmpty',
        'last', 'lastIndexOf', 'map', 'max', 'min', 'reduce',
        'reduceRight', 'reject', 'rest', 'sample', 'select',
        'shuffle', 'size', 'some', 'sortBy', 'tail', 'take',
        'toArray', 'without',
    ];
    // Mix in each Underscore method as a proxy to `Overview#view`.
    _.each(methods, function(method) {
        Overview.prototype[method] = function() {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(this.views);
            return _[method].apply(_, args);
        };
    });
    _.extend(Overview.prototype, View.prototype);
    Overview.extend = View.extend;


    Backbone.OrderedListView = Backbone.Overview.extend({

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

        initialize () {
            this.sortEventually = _.debounce(this.sortAndPositionAllItems.bind(this), 500);
            this.items = _.get(this, this.listItems);
            this.items.on('add', this.createItemView, this);
            this.items.on('add', this.sortEventually, this);
            this.items.on(this.sortEvent, this.sortEventually, this);
        },

        createItemView (item) {
            let item_view = this.get(item.get('id'));
            if (!item_view) {
                item_view = new this.ItemView({model: item});
                this.add(item.get('id'), item_view);
            } else {
                item_view.model = item;
                item_view.initialize();
            }
            item_view.render();
            return item_view;
        },


        sortAndPositionAllItems () {
            this.items.sort();
            this.items.each((item) => {
                if (_.isUndefined(this.get(item.get('id')))) {
                    this.createItemView(item)
                }
                this.positionItem(item, this.el.querySelector(this.listSelector));
            });
        },

        positionItem (item, list_el) {
            /* Place the View's DOM element in the correct alphabetical
             * position in the list.
             *
             * IMPORTANT: there's an important implicit assumption being
             * made here. And that is that initially this method gets called
             * for each item in the right positional order.
             *
             * In other words, it gets called for the 0th, then the
             * 1st, then the 2nd, 3rd and so on.
             *
             * That's why we call it in the "success" handler after
             * fetching the items, so that we know we have ALL of
             * them and that they're sorted.
             */
            const view = this.get(item.get('id')),
                index = this.items.indexOf(item);

            if (index === 0) {
                list_el.insertAdjacentElement('afterbegin', view.el);
            } else if (index === (this.items.length-1)) {
                list_el.insertAdjacentElement('beforeend', view.el);
            } else {
                const neighbour_el = list_el.querySelector('li:nth-child('+index+')');
                neighbour_el.insertAdjacentElement('afterend', view.el);
            }
            return view;
        }
    });

    return Backbone.Overview;
}));
