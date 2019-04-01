SVG Extend is a standalone library that extend the SVG declarative API

It provides extended component that can be used inside any SVG document


## Usage

The SVG Extend library provides a declarative API to easily create some basic
shapes that are currently not part of the SVG specification:

* Regular polygons and stars
* _Spirales_ (WIP)
* _Auto smooth lines and shape_ (TBD)


## Installation

You can use your usual building tools and install the library through npm:

`npm i svg-extend --save`

> **Note :** By default, svg-extend is provided as a set of ES6 modules. If you
> want to use it with old browsers such as IE11 you can use a transpiler
> such as [Babel](https://babeljs.io/) to build it yourself.
>
> As a convenience, and mostly because the SVG `<script>` tag does not support
> ES6 modules, the library is provided with a bundle (the `svg-extend.js` file)
> that can be used out of the box in any browser.


### Compatibility

The library has been tested with the following browsers:
  * Chrome 72+
  * Firefox 66+
  * Safari 12+

Once transpiled into ES5, it should be compatible with any browser supporting
the `MutationObserver` API (which include IE11)

## Implementation notes

Because the `customElements` API is [not supporting anything outside of the
HTML namespace](https://github.com/w3c/webcomponents/issues/634), this library
is using the `MutationObserver` API as a workaround.

It allows to provide the same declarative API through the `is` attribute but it
has two drawbacks:

  1. It doesn't allowed to extend the DOM API which constrain the programatic
     APIs to those of the extended elements (either `SVGPathElement`,
     `SVGPolygonElement`, or `SVGPolylineElement`)
  2. `MutationObserver` can have a significant performance impact in some
      cases, therefor it can be unsuitable if you plan to work on documents
      with a very large DOM tree or with heavy DOM manipulations (even if you
      plan to use libraries like [React](https://reactjs.org/) that tend to
      reduce the DOM manipulation hassle).
