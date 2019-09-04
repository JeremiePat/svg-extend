---
layout: default
title: SVG Known Issues
nav_order: 4
permalink: /svg-known-issues
---

# SVG Known Issues

SVG as some known issues that worth knowing when using it as it can require
some tricky workarounds to deal with them. *SVG Extend* doesn't plan to fix
them nor to provide workarounds but we document those issues here in order to
better know what difficulties we are facing.

## No ECMAScript modules with SVG

Neither [Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=717643)
nor Firefox support ES modules with the SVG element:
`<script type="module">`.

No easy fix here. If you are using SVG within HTML, use the HTML `<script>`
element instead. If you are in a standalone SVG document, you have to build
your modules into a single file (for example with [WebPack](https://webpack.js.org/))

## CSS `backface-visibilty`

[Google Chrome doesn't support the CSS property `backface-visibility` on SVG
elements](https://bugs.chromium.org/p/chromium/issues/detail?id=954501). This
is due to the lack of some compositing mechanics for SVG within Google Chrome.
There is no easy fix for that as it requires to rework the whole Google Chrome
SVG implementation.

This lack of support has an impact when using CSS transforms. As
`backface-visibility` isn't supported, a `180deg` rotation on the _x_ or _y_
axis will flip a shape instead of hiding it. If this is the intended purpose, A
possible workaround consist in limiting rotation to `90deg`. This can be tricky
when dealing with animation as it requires to think animation that are somewhat
shorter than expected and with side effects on easing. Another possible
workaround to prevent those side effect is to apply an `opacity:0`,
`visible:hidden` or `display:none` to the element when appropriate (usually at
50% of the animation). However, even like that, for none linear animation it
can be tricky to find the right moment to hide the element.

## CSS Gradients (and other CSS image functions)

As per the SVG spec, [CSS gradients cannot be used as paint server](https://svgwg.org/svg2-draft/painting.html#SpecifyingPaint)
for `fill` and `stroke`. This is mainly due to some
[sizing computation issues between CSS and SVG](https://github.com/w3c/svgwg/issues/167)
specs that needs to be resolved.

## No `customElement` API

As per the spec, the `customElement` API only apply to HTML content. SVG has
been put [out of scope on purpose](https://github.com/w3c/webcomponents/issues/634).
This is a spec issue due to a lack of commitment from implementors (See
[this tweet for a possible way to convince implementors to get into it](https://twitter.com/annevk/status/1107973506854256640)).


## Remote ressources

[Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=109212), [Safari](https://bugs.webkit.org/show_bug.cgi?id=65344) and IE11 do not apply distant paint servers. (IE11 also fail at displaying remote elements with the `<use>` element)

It also appears that Chrome, Safari and Firefox does not apply stylesheets that are part of the `<use>` shadow tree to elements of that same shadow tree.

For more details see [this full tests suite](tests/use-and-paint).

## SVG Animation controls

When an SVG animation element is listening for an element with an ID event, Google Chrome only accept event from SVG elements but not from HTML element.

In [the following example](tests/doc-controls), the circle may become blue but it cannot be green on Google Chrome:

```xml
<button id="GRN">
  Make it green
</button>

<svg viewBox="0 0 100 150">
  <rect id="BLU" width="100%" height="20" />
  <text x="50" y="15" fill="white">Make it blue</text>

  <circle cx="50" cy="75" r="25">
    <set begin="GRN.click" attributeName="fill" to="green" />
    <set begin="BLU.click" attributeName="fill" to="blue" />
  </circle>
</svg>
```
