import extendSVGElements from './lib/extendSVGElements.js'
import ngon   from './lib/element.ngon.js'
import star   from './lib/element.star.js'
import spiral from './lib/element.spiral.js'

// We preamptively initialized the library components
extendSVGElements(ngon)
extendSVGElements(star)
extendSVGElements(spiral)
