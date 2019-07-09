import { toCartesian, toNum, toNumList } from './utils.js'

const spiralType = {
  /**
   * Parametric spirals are divergent spirals that grow either reguraly or exponentialy
   *
   * @param { Number } theta The angle of the point we want to get
   * @param { Number } a The regular progressing factor of the spiral
   * @param { Number } b The exponential progressing factor of the spiral
   * @return { Number } The distance to the spiral point
   */
  parametric (theta, a = 1, b = 0) {
    const c = Math.PI * 2 // 360deg
    const t = theta / c   // Number of turns

    return /* Regular progression */ a * t /* Exponential progression */ + Math.pow(b + 1, t) - 1
  },

  /**
   * Archimedean spirals are divergent regular spirals
   *
   * An archimedean spiral is a regular spiral that increase at the speed given
   * by the `b` parameter. It worth noting that if `b` is equal to `0`, the
   * spiral will actually produce a visual circle
   *
   * @param { Number } theta The angle of the point we want to get
   * @param { Number } a The distance between the center of the spiral and the first point of the spiral
   * @param { Number } b The factor that increase uniformaly the distance between each spire of the spiral
   * @return { Number } The distance to the spiral point
   */
  archimedean (theta, a = 0, b = 1) {
    return a + b * theta
  },

  /**
   * Galileo spirals are divergent spirals
   *
   * Because galileo spirals are growing slowly over time but moving away from
   * their center very fast, better visual results are achieve with high
   * growing factor (`b` >= 2) and more than 10 turn with a small zoom factor
   * (`a` =< 1)
   *
   * @param { Number } theta The angle of the point we want to get
   * @param { Number } a The spiral zoom factor
   * @param { Number } b The spiral growing factor
   * @return { Number } The distance to the spiral point
   */
  galileo (theta, a = 1, b = 2) {
    return a * Math.pow(theta, b)
  },

  /**
   * Hyperbolic spirals are convergent spirals
   *
   * @param { Number } theta The angle of the point we want to get
   * @param { Number } a The diameter of the convergence circle (0 means the spiral is converging to a point)
   * @param { Number } b The spiral "zoom" factor (it indicate how slow the spiral is converging to the convergence circle)
   * @return { Number } The distance to the spiral point
   */
  hyperbolic (theta, a = 1, b = 1) {
    return a + b / theta
  },

  /**
   * Inset spirals are diverging spirals that are include inside a circle
   *
   * @param { Number } theta The angle of the point we want to get
   * @param { Number } a The radius of the circle including the spiral
   * @param { Number } b The converging speed of the spiral
   * @return { Number } The distance to the spiral point
   */
  inset (theta, a=1, b=15) {
    return a * (theta / (b + theta))
  },

  // Lituus spirals are convergent spirals
  lituus (theta, a = 1, b = 1) {
    return a * Math.sqrt(b / theta)
  },

  /**
   * Logarithmic spirals are divergent exponetial spirals
   *
   * `a` represent the diameter of the circle upon which the spiral is based on
   * but in practice any value greater than `O` shifts the starting point of
   * the spiral from the center along the x axis
   *
   * Note that the spiral is growing very fast so in practice, for the `b`
   * parameter, you'll prefere a value around 0.1
   *
   * @param { Number } theta The angle of the point we want to get
   * @param { Number } a The diameter (zoom factor) of the circle upon which the spiral is based on
   * @param { Number } b The growing (speed) factor of the spiral
   * @return { Number } The distance to the spiral point
   */
  logarithmic (theta, a = 1, b = 0.1) {
    return a * Math.exp(b * theta)
  },

  /**
   * Metalic spirals are logarithmic spirals with a metalic ratio
   *
   * For metalice spirals, `b` is a positive integer (a value of 1 produce a
   * golden spiral, a value of 2 a silver spiral, and so on).
   *
   * As those spirals grow very fast, it's sometime necessary to compensate
   * with small values of a (usualy below 0.05)
   *
   * @param { Number } theta The angle of the point we want to get
   * @param { Number } a The diameter (zoom factor) of the circle upon which the spiral is based on
   * @param { Number } b The type of metalic spiral
   * @return { Number } The distance to the spiral point
   */
  metalic (theta, a = 1, b = 1) {
    b = Math.floor(b)
    const { pow, sqrt, log, PI } = Math
    const metalicRatio = log((b + sqrt(4 + pow(b, 2))) / 2) / (PI / 2)

    return spiralType.logarithmic(theta, a, metalicRatio)
  }
}

// ----------------------------------------------------------------------------
// Specific utilities fonctions to handle stars
// ----------------------------------------------------------------------------

/**
 * Get all relevant attribute values from a spiral node
 *
 * Relevant attributes are:
 *  - cx:      X coordinate of the center of the spiral
 *             type: Number, default: 0, range: [-∞,+∞]
 *  - cy:      Y coordinate of the center of the star
 *             type: Number, default: 0, range: [-∞,+∞]
 *  - step:    The number of line we want to draw each turn of the spiral
 *             type: Number, default: 10, range [1,+∞]
 *  - turn:    The number of turn we want to draw
 *             type: Number, default: 3, range: [1,+∞]
 *  - type:    The type of spiral to draw
 *             type: String, default: 'archimedean', range: ['archimedean','galileo','hyperbolic','inset','lituus','logarithmic','metalic','parametric']
 *  - a:       The first parameter of the spiral (it's exact meaning depend on each spiral type)
 *             type: Number, default: 0, range: [0,+∞]
 *  - b:       The second parameter of the spiral (it's exact meaning depend on each spiral type)
 *             type: Number, default: 0, range: [0,+∞]
 *  - scale:   A scale factor to apply to the spiral
 *             type: Number, default: 1, range: [0,+∞]
 *  - smooth:  A hint to approximate a smooth spiral even with very few steps
 *             type: Boolean, default: false
 *
 * @param { Object } node The DOM Node from which we want to extract its attributes
 * @return { Object:cx,cy,step,turn,type,a,b,scale,smooth }
 */
function _getAttr (node) {
  const t = node.getAttribute('type')

  return {
    cx    : toNum(node.getAttribute('cx')),
    cy    : toNum(node.getAttribute('cy')),
    step  : toNum(node.getAttribute('step'), 10, 1),
    turn  : toNumList(node.getAttribute('turn'), 3, 1),
    type  : t in spiralType ? t : 'archimedean',
    a     : toNum(node.getAttribute('a'), 0, 0),
    b     : toNum(node.getAttribute('b'), 0, 0),
    scale : toNum(node.getAttribute('scale'), 1, 0),
    smooth: node.getAttribute('smooth') === 'true'
  }
}

/**
 * Compute the angle of each step necessary to compute the whole spiral
 *
 * @param { Number } step The number of step by turn
 * @param { Number } turn The number of turn the spiral will perform
 * @return { Array<Number> }
 */
function _getSteps (step, turn) {
  const steps = new Array(1 + step * turn)
  return steps.fill(2 * Math.PI / step).map((val, i) => val * i)
}

/**
 * Get the cartesian coordonate of all the points representing the spiral
 *
 * @param { Array    } steps An array of the angle for each step of the spiral
 * @param { Number   } scale The scale factor to apply to the spiral
 * @param { Function } fn The spiral function from `spiralType`
 * @param { Number   } cx The x coordinate for the center of the spiral
 * @param { Number   } cy The y coordinate for the center of the spiral
 * @return { Array<Number> }
 */
function _getPoints (steps, scale, fn, cx, cy) {
  return steps.reduce((arr, angle) => {
    const { x, y } = toCartesian(scale * fn(angle), angle, cx, cy)

    if (x === +x && y === +y) {
      arr.push(x, y)
    }
    return arr
  }, [])
}

/**
 * Get the curve definition of a spiral approximation
 *
 * /!\ This a very rough attempt at approximating a spiral with Bézier
 *      curves. It is highly experimental and far from realiable.
 *
 * @param { Array    } steps An array of the angle for each step of the spiral
 * @param { Number   } scale The scale factor to apply to the spiral
 * @param { Function } fn The spiral function from `spiralType`
 * @param { Number   } cx The x coordinate for the center of the spiral
 * @param { Number   } cy The y coordinate for the center of the spiral
 * @param { Number   } nbPerTurn Number of turn to draw the spiral
 * @return { Array }
 */
function _getCurve  (steps, scale, fn, cx, cy, nbPerTurn) {
  return steps.reduce((arr, angle, i) => {
    const r = scale * fn(angle)
    const { x, y } = toCartesian(r, angle, cx, cy)

    if (x !== +x || y !== +y) {
      return arr
    }

    if (i === 0) {
      return arr.concat(['M', x, y])
    }

    // Many magic values here, at some point it will be good
    // to do some proper math, but it's good enough for now
    // It is a very rough approximation and it has to be adjusted
    // based on the type of each curves the following tests are
    // best adjusted for the parametric spiral

    // Length multiplicator for the tangent
    const ln = 2 / nbPerTurn + 1 / Math.pow(nbPerTurn, 2.15)
    // Angle slight adjustement for the tangent
    const ag = 0.5 + 0.25 / i

    const { x: x2, y: y2 } = toCartesian(ln * r, angle - (ag * Math.PI), x, y)

    return arr.concat(['S', x2, y2, x, y])
  }, [])
}

// SHAPE DEFINITIONS
// ----------------------------------------------------------------------------
// A shape definition is an object with the following properties
//
//  - name   : { String }   : This is the value for the `is` attribute, it
//                            must contain a dash.
//  - extend : { Array }    : An array of the tag names to extend
//  - attr   : { Array }    : An array of all the attribute that matters to
//                            observe for the extended element
//  - update : { Function } : A callback function that will update the state of
//                            the element when attributes change or when a new
//                            element is inserted in the DOM
// ----------------------------------------------------------------------------

// SPIRAL DEFINITION
// ----------------------------------------------------------------------------
const spiral = {
  name: 'n-spiral',
  extend: ['polyline', 'path'],
  attr: ['is', 'cx', 'cy', 'turn', 'step', 'type', 'a', 'b', 'scale', 'smooth'],
  update (node) {
    const { step, turn, cx, cy, a, b, scale, type, smooth }  = _getAttr(node)
    const steps = _getSteps(step, turn)
    const fn    = (angle) => spiralType[type](angle, a, b)

    if (node.nodeName === 'polyline') {
      node.setAttribute('points', _getPoints(steps, scale, fn, cx, cy).join())
    }

    else {
      node.setAttribute('d', smooth
        ? _getCurve(steps, scale, fn, cx, cy, step).join(' ')
        : 'M' + _getPoints(steps, scale, fn, cx, cy).join())
    }
  }
}

// Expose our definition to be usable on demand
export default spiral
