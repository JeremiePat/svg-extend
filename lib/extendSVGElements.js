// ----------------------------------------------------------------------------
// Mutation observer
// ----------------------------------------------------------------------------

// We need only one observer (this need to be asserted in terms of performance cost)
const observer = new MutationObserver(mList => {
  observer.cbList.forEach(fn => fn(mList))
})

observer.cbList = []
observer.attrFilter = {}

// We need to observe the whole tree change to spot if new elements
// matching our extend elements are added to the DOM
observer.observe(document.documentElement, { childList: true, subtree: true })

// ----------------------------------------------------------------------------
// Module API
// ----------------------------------------------------------------------------

const NEW_SVG_ELEMENTS = []

/**
 * Enable a new SVG element following its definition
 *
 * @param { Object:name,extend,attr,update } def A new SVG element definition
 */
function extendSVGElements (def) {
  // We want to make sure that definition for a given new element occures one time only
  if (NEW_SVG_ELEMENTS.indexOf(def.name) > -1) { return }

  NEW_SVG_ELEMENTS.push(def.name)

  function onMutate (mList) {
    for (let i = 0, l = mList.length; i < l; i++) {
      const m = mList[i]

      if (
        m.type === 'attributes' &&
        m.target.getAttribute('is') === def.name &&
        def.extend.indexOf(m.target.nodeName) > -1 &&
        def.attr.indexOf(m.attributeName) > -1
      ) {
        def.update(m.target)
      }

      else if (m.type === 'childList') {
        for (let j = 0, k = m.addedNodes.length; j < k; j++) {
          const node = m.addedNodes[i] // for ... of could slightly slow things down if we have a giganormous number of nodes to handle

          // We observe any tag that could get a valid `is` attribute now or in the future
          // Looking attribute changes where they are supposed to happen is less expensive than
          // using a "catch all" strategy with MutationObserver
          if (def.extend.indexOf(node.nodeName) > -1) { // Faster than `matches` and it allows us to filter text nodes out
            observer.observe(node, { attributes: true })

            // if the node has the proper `is` attribute value we update it
            if (node.getAttribute('is') === def.name) { // This is the fastest way to check an attribute existence and value
              def.update(node)
            }
          }
        }
      }
    }
  }

  document.querySelectorAll(def.extend.join()).forEach(node => {
    // We need to observe all attribute that we extend in case the `is`
    // attribute is set afterward. This can be heavy on large documents.
    observer.observe(node, { attributes: true })

    if (node.getAttribute('is') === def.name) {
      def.update(node)
    }
  })

  observer.cbList.push(onMutate)
}

// We export the extendSVGElements fonction to
// let people create their on SVG elements
export default extendSVGElements
