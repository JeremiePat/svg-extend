import extendSVGElements from './lib/extendSVGElements.js'

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
  // Init new elements here
})
