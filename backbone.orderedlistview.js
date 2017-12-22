/*!
 * Backbone.OrderedListView
 *
 * Copyright (c) 2017, JC Brand <jc@opkode.com>
 * Licensed under the Mozilla Public License (MPL) 
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["underscore", "backbone", "backbone.overview"], factory);
   } else {
      // RequireJS isn't being used.
      // Assume underscore and backbone are loaded in <script> tags
        factory(_ || root._, Backbone || root.Backbone);
   }
}(this, function (_, Backbone) {
    "use strict";

    Backbone.OrderedListView = Backbone.Overview.extend({
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

        initialize () {
            this.sortEventually = _.debounce(
                this.sortAndPositionAllItems.bind(this), 500);

            this.items = _.get(this, this.listItems);
            this.items.on('add', this.sortAndPositionAllItems, this);
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
            if (!this.items.length) {
                return;
            }
            this.items.sort();

            const list_el = this.el.querySelector(this.listSelector);
            const div = document.createElement('div');
            list_el.replaceWith(div);
            this.items.each((item) => {
                let view = this.get(item.get('id'));
                if (_.isUndefined(view)) {
                    view = this.createItemView(item)
                }
                list_el.insertAdjacentElement('beforeend', view.el);
            });
            div.replaceWith(list_el);
        }
    });

    return Backbone.OrderedListView;
}));
