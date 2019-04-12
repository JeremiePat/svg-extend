---
layout: default
title: Extended elements
nav_order: 3
has_children: true
has_toc: false
permalink: /element
---

*SVG Extend* propose various extension to SVG among which elements extension.
Elements are extended through the `is` attribute and gain some new attributes
to deal with the extension.

| Name                                                 | `is` value | Extend                              | New Attributes                       |
|:-----------------------------------------------------|:-----------|:------------------------------------|:-------------------------------------|
| [ngon]({{ site.baseurl }}{% link element.ngon.md %}) | `n-gon`    | `<path>`, `<polygon>`, `<polyline>` | `cx`, `cy`, `r`, `vertex`, `density` |
| [star]({{ site.baseurl }}{% link element.star.md %}) | `n-star`   | `<path>`, `<polygon>`, `<polyline>` | `cx`, `cy`, `r`, `vertex`            |
