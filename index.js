import extendSVGElements from './lib/extendSVGElements.js'
import ngon   from './lib/element.ngon.js'
import star   from './lib/element.star.js'

const ready =  new Promise(resolve => {
  if (
    document.readyState === 'interactive' ||
    document.readyState === 'complete'
  ) {
    return resolve()
  }

  window.addEventListener('DOMContentLoaded', resolve)
})

// We preamptively initialized the library components
ready.then(() => {
  extendSVGElements(ngon)
  extendSVGElements(star)
})
