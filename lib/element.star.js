import { toNum, toNumList, toCartesian } from './utils.js'

// ----------------------------------------------------------------------------
// Specific utilities fonctions to handle stars
// ----------------------------------------------------------------------------

/**
 * Get all relevant attribute values from a star node
 *
 * Relevant attributes are:
 *  - cx:     X coordinate of the center of the star
 *            type: Number, default: 0, range: [-∞,+∞]
 *  - cy:     Y coordinate of the center of the star
 *            type: Number, default: 0, range: [-∞,+∞]
 *  - r:      The list of radius along which vertex are positionned
 *            type: <Number>, default: [0], range: [0,+∞]
 *  - vertex: The number of vertex that must be computed for each radius
 *            type: Number, default: 3, range: [3,+∞]
 *
 * @return { Object:cx,cy,r,vertex }
 */
function _getAttr (node) {
  return {
    cx    : toNum(node.getAttribute('cx')),
    cy    : toNum(node.getAttribute('cy')),
    r     : toNumList(node.getAttribute('r'), 0, 0),
    vertex: toNum(node.getAttribute('vertex'), 3, 3)
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
function _getVertex (cx, cy, r, n, startAngle = Math.PI/2) {
  const vertex = []
  const sideAngle = 2 * Math.PI / n

  for (let i = 0; i < n; i++) {
    let angle = startAngle + (i * sideAngle)

    vertex.push(toCartesian(r, angle, cx, cy))
  }

  return vertex
}

/**
 * Provide the list of all points for drawing the shape as a single valid SVG string
 *
 * @param { Object:cx,cy,r,vertex } attr The object representing the attributes of the node we want to update
 * @return { String }
 */
function _makePointList (attr) {
  const { r, vertex, cx, cy } = attr

  // We have n vertex per circle but over all we want all the vertex of each
  // circle distributed evenly so we need a shift angle that is cumulativly
  // applied to the start angle of each circle.
  const shiftAngle = 2*Math.PI / (vertex*r.length)

  const vList = r.map((radius, index) => {
    // As we want the first point of each star at the top of the circle
    // we need to have a startAngle shift by 90deg plus the shiftAngle
    // apply to each circle.
    const startAngle = shiftAngle*index - Math.PI/2

    return _getVertex(cx, cy, radius, vertex, startAngle)
  })

  const points = []

  // We flatten all vertex from all circle into a single series of vertex
  // that will represent all the points of the final path
  for (let i = 0; i < vertex; i++) {
    vList.forEach(v => {
      points.push(v[i].x, v[i].y)
    })
  }

  return points.join()
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

// STAR DEFINITION
// ----------------------------------------------------------------------------
const star = {
  name:   'n-star',
  extend: ['path', 'polygon', 'polyline'],
  attr:   ['is', 'cx', 'cy', 'r', 'vertex'],
  update (node) {
    const attr = node.nodeName === 'path'
      ? ['d',      'M' + _makePointList(_getAttr(node)) + 'z']
      : ['points', _makePointList(_getAttr(node))]

    node.setAttribute(...attr)
  }
}

// Expose our definition to be usable on demand
export default star
