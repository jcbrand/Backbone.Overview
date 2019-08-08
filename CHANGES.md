Changelog
=========

1.0.3 (2019-08-08)
------------------

* Remove all views on `reset` event
* Debounce `sortAndPositionAllItems` on `add` event
* New property for Backbone.OrderedListView: `sortImmediatelyOnAdd`

1.0.2 (2018-01-29)
------------------

* Found another `ChildNode.replaceWith`

1.0.1 (2018-01-22)
------------------

* `ChildNode.replaceWith` is not available in Internet Explorer or Safari. Use `Node.replaceChild` instead.

1.0.0 (2018-01-15)
------------------

* Add `Backbone.OrderedListView`
* Use Backbone.NativeView instead of Backbone.View, if it's available

0.0.3 (2016-11-03)
------------------

* Use `that` instead of `bind`.
* Return the view when calling `removeAll`.
* Make more underscore methods available.

0.0.2 (2016-03-07)
------------------

* Add exclusive get: `xget`

0.0.1 (2015-08-27)
------------------

* Initial release
