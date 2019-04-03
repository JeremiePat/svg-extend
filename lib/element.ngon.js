import { toNum, toCartesian } from './utils.js'

// ----------------------------------------------------------------------------
// Specific utilities fonctions to handle stars
// ----------------------------------------------------------------------------

/**
 * Get all relevant attribute values from a star node
 *
 * Relevant attributes are:
 *  - cx:      X coordinate of the center of the star
 *             type: Number, default: 0, range: [-∞,+∞]
 *  - cy:      Y coordinate of the center of the star
 *             type: Number, default: 0, range: [-∞,+∞]
 *  - r:       The radius of the circle along which vertex are positionned
 *             type: Number, default: 0, range: [0,+∞]
 *  - vertex:  The number of vertex that must be computed for each radius
 *             type: Number, default: 3, range: [3,+∞]
 *  - density: define how to alternatively join each vertex
 *             type: Boolean, default: true, range: true|false
 *
 * @return { Object:cx,cy,r,vertex }
 */
function _getAttr (node) {
  return {
    cx     : toNum(node.getAttribute('cx')),
    cy     : toNum(node.getAttribute('cy')),
    r      : toNum(node.getAttribute('r'), 0, 0),
    vertex : toNum(node.getAttribute('vertex'), 3, 3),
    density: toNum(node.getAttribute('density'), 1, 0)
  }
}

/**
 * Compute the coordinate of all vertex
 *
 * @param { Number } cx The x coordinate of the circle from which all vertex are computed from
 * @param { Number } cy The y coordinate of the circle from which all vertex are computed from
 * @param { Number } r  The radius of the circle from which all vertex are computed from
 * @param { Number } n  The number of vertex to compute
 * @param { Number } startAngle The angle of the first vertex (the first vertex has a polar coordinate of r,startAngle)
 * @return { Array<Object:x,y> }
 */
function _getVertex (cx, cy, r, n, density, startAngle = -Math.PI / 2) {
  const vertex = [[]]

  const sideAngle = 2 * Math.PI / n

  for (let i = 0, shift = 0; i < n; i++) {
    let v = vertex[vertex.length - 1]
    let p = (shift + i * density) % n

    // Degenerative forms are usualy more visualy appealing if we
    // follow the Coexter convention on how to draw such stars.
    // See: https://en.wikipedia.org/wiki/Regular_polygon#Regular_star_polygons
    if (v.indexOf(p) > -1) {
      vertex.push([])
      v = vertex[vertex.length - 1]
      shift += 1
      p += 1
    }

    v.push(p)
  }

  return vertex.map(arr => arr.map(v => toCartesian(r, startAngle + sideAngle * v, cx, cy)))
}

/**
 * Provide the list of all points for drawing the shape as a single valid SVG string
 *
 * @param { Object:cx,cy,r,vertex } attr The object representing the attributes of the node we want to update
 * @return { String }
 */
function _makePointList (attr) {
  const { r, vertex, cx, cy, density } = attr

  // console.log(_getVertex(cx, cy, r, vertex, density))
  const points = _getVertex(cx, cy, r, vertex, density)
    .map(arr => arr.map(p => `${p.x},${p.y}`).join())

  return points
}

// SHAPE DEFINITIONS
// ----------------------------------------------------------------------------
// A shape definition is an object with the following properties
//
//  - name   : { String }   : This is the value for the `is` attribute, it must contain a dash.
//  - extend : { Array }    : An array of the tag names to extend
//  - attr   : { Array }    : An array of all the attribute that matters to observe for the extended element
//  - update : { Function } : A callback function that will update the state of the element when attributes change or when a new element is inserted in the DOM
//
// ----------------------------------------------------------------------------

// EUCLIDIAN POLYGON DEFINITION
// ----------------------------------------------------------------------------
const ngon = {
  name:   'n-gon',
  extend: ['path', 'polygon', 'polyline'],
  attr:   ['is', 'cx', 'cy', 'r', 'vertex', 'density'],
  update (node) {
    const attr = node.nodeName === 'path'
      ? ['d',      'M' + _makePointList(_getAttr(node)).join('z M') + 'z']
      : ['points', _makePointList(_getAttr(node)).join()]

    node.setAttribute(...attr)
  }
}

// Expose our definition to be usable on demand
export default ngon
