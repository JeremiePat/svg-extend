---
layout: default
title: Getting Started
nav_order: 2
permalink: /install.html
---

# Getting started

There are different ways to use the *SVG Extend* library. However, before using it,
there are some limitations that you should be aware of:

  * This library is using the [`MutationObserver` API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
    to implement some of its features (in particular, everything that let you
    manipulate and create elements programmatically). Unfortunately,
    `MutationObserver` can have a significant performance impact in some cases,
    therefor it can be unsuitable if you plan to work on documents with a very
    large DOM tree or with heavy DOM manipulations (even if you plan to use
    libraries like [React](https://reactjs.org/) that tend to reduce the DOM
    manipulation hassle).
  * Because this library is a script it cannot be used in a context where SVG
    is used as-an-image. In clear it means that if your are using SVG through
    an HTML `<img>` element or through a CSS `background-image` property, the
    script won't be executed and you won't get the result you are expecting.

## Install

The easiest way to install and use *SVG Extend* is through NPM:

```bash
npm i svg-extend --save
```

It is also possible to use other installers that are comfortable using Git
repository, for example with Bower:

```bash
bower install git://github.com/JeremiePat/svg-extend.git
```

Ultimately, it is possible to clone or [download](https://github.com/JeremiePat/svg-extend/archive/master.zip)
the *SVG Extend* Git repository.

In the end, it all depends on your build system. For the rest of this document,
we will assume that you've installed *SVG Extend* through NPM and that you are
using WebPack to build your documents.

## Out of the box

SVG Extend can be use out of the box by simply include the *SVG Extend*
library in your document, which will enabled all available features.

### With WebPack

In your `./src/index.js` file (default WebPack entry point) just import the
library

```js
import 'svg-extend'
```

Build and call the resulting script in your HTML document:

```html
<!-- in an HTML document -->
<script src="./dist/main.js"></script>
```

Or in a standalone SVG file:

```html
<!-- in an SVG document -->
<script xlink:href="./dist/main.js"></script>
```

### Direct call

If you don't use any bundler, you can directly call our pre-bundle script
`svg-extend.js`. For example with a Bower install:

```html
<!-- in an HTML document -->
<script src="bower_components/svg-extend/svg-extend.js"></script>
```

> **NOTE** *If you are targeting browsers supporting ES modules, you could call
> `index.js` instead of `svg-extend.js`. However, be careful because browsers
> supporting ES modules doesn't support modules with the  SVG `<script>`
> element, therefor, the following isn't working:*
>
> ```html
> <!-- type="module" doesn't work with the SVG <script> element -->
> <script xlink:href="bower_components/svg-extend/index.js" type="module"></script>
> ```
{: .fs-3 }

## Cherry pick with modules

If you don't want to use the whole *SVG Extend* library you can cherry pick
what ever you need directly:

In your `./src/index.js` file (default WebPack entry point) just import the
`extendSVGElements` function and the features you want to use:

```js
// Got the extendSVGElements function to setup features on demand
import extendSVGElements from 'svg-extend/lib/extendSVGElements.js'

// Got the star element definition
import star from 'svg-extend/lib/element.star.js'

// Enable the star extended element only
// Feel free to create your own custom elements too
extendSVGElements(star)

// Note that extendSVGElements is asynchronous
// and will be resolved only once the DOM is ready
```

Build and call the resulting script in your HTML document:

```html
<!-- in an HTML document -->
<script src="./dist/main.js"></script>
```

Or in a standalone SVG file:

```html
<!-- in an SVG document -->
<script xlink:href="./dist/main.js"></script>
```
