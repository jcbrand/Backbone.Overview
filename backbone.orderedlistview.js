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

    return Backbone.OrderedListView;
}));
