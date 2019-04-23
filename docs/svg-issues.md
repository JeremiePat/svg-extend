---
layout: default
title: SVG Known Issues
nav_order: 4
permalink: /svg-known-issues
---

# SVG Known Issues

SVG as some known issues that worth knowing when using it as it can require
some tricky workarounds to deal with them. *SVG Extend* doesn't plan to fix
them nor to provide workarounds but we document them here in order to better
know what difficulties we are facing.

## No EcmaScript modules with SVG

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
There is no easy fix for that as it requires to fully rework Google Chrome
implementation of SVG.

This lack of support has an impact when using CSS transforms. As
`backface-visibility` isn't supported, a 180deg rotation on the x or y axis
will flip a shape instead of hiding it. If this is the intended purpose, A
possible workaround consist in limiting rotation to 90deg. This can be tricky
when dealing with animation as it requires to think animation that are somewhat
shorter than expected and with side effects on easing.

## No `customElement` API

As per the spec, [the `customElement` API only apply to HTML content](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-core-concepts).
SVG has been put [out of scope on purpose](https://github.com/w3c/webcomponents/issues/634).
This is a spec issue with due to a lack of commitment from implementors (See
[this tweet for a possible way to convince implementors to get into it](https://twitter.com/annevk/status/1107973506854256640)).
