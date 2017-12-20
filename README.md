# Backbone.Overview

This package provides two new types of Backbone Views.

* Backbone.Overview
* Backbone.OrderedListView

## The two different View types

## Backbone.Overview

An Overview is a View that references and keeps track of sub-views (i.e. just normal Backbone.Views)
Kind of like what a Collection is to a Model.

An Overview provides methods for handling the views it keeps track of:

  * add(id, view)
  * get(id)
  * getAll()
  * keys()
  * remove(id)
  * removeAll()

## Backbone.OrderedListView

An OrderedListView is a special type of Overview which handles the case where
you have a list of items that need to be presented in a certain order.

The order is determined by your Overview's [comparator](http://backbonejs.org/#Collection-comparator)
attribute or method.

The OrderedListView relies on a few conventions and then has three attributes
which you set in order to configure it for your usecase. 

These are:

* `listItems` (Default value `'model'`)
    The `listItems` attribute denotes the path (from this View) to the
    list of items. This list must be a Backbone.Collection.
* `sortEvent` (Default value `'change'`)
    The `sortEvent` attribute specifies the event which should cause the
    ordered list to be sorted.
* `listSelector` (Default value `'.ordered-items'`)
    The `listSelector` is the selector used to query for the DOM list
    element which contains the ordered items.
* `ItemView` (Default value `undefined`)
    The `itemView` is constructor which should be called to create a
    View for a new item to be rendered in the list.

When an item changes, as defined by the `sortEvent`, then the OrderedListView
will automatically sort the list and rerender the items in order.

When new items are added to the Backbone.Collection specified by `listItems`,
then the OrderedListView will automatically add a new View for that item (as
specified by `ItemView`) and insert it into the ordered list.

## Usage

Include Backbone.Overview after having included Backbone.js:

```html
    <script type="text/javascript" src="backbone.js"></script>
    <script type="text/javascript" src="backbone.overview.js"></script>
```

Create your overview like this:

```javascript
    this.RosterView = Backbone.Overview.extend({
    // ... same customizations as you would make for a normal Backbone.View
    });
```

### Underscore

You can use the usual underscore methdods, like you can with Backbone
Collections.

For example:

```javascript
    this.rosterview = new this.RosterView();
    this.rosterview.add(new Backbone.View({model: new Backbone.Model()));

    this.rosterview.each(function (view) {
        // Do something
    });
```

### RequireJS

Include [RequireJS](http://requirejs.org):

```html
    <script type="text/javascript" src="lib/require.js"></script>
```

RequireJS config: 
```javascript
    require.config({
        paths: {
            jquery: "lib/jquery",
            underscore: "lib/underscore",
            backbone: "lib/backbone",
            backbone.overview: "lib/backbone.overview"
        }
    });
```

```javascript
    define(["backbone.overview"], function() {
        this.RosterView = Backbone.Overview.extend({
        // ... same customizations as you would make for a normal Backbone.View
        });
    });
```
## Real-world example 

Overviews and OrderedListViews are used in [converse.js](http://conversejs.org)
