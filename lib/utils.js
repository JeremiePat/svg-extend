
// ----------------------------------------------------------------------------
// TYPE CONVERSION
// ----------------------------------------------------------------------------

/**
 * Convert a string to a number
 *
 * @param { String } str The string to convert
 * @param { Number } defaultValue The default value to return if str is converted to NaN
 * @param { Number } minValue Clamp the converted number to that minimum value
 * @param { Number } maxValue Clamp the converted number to that maximum value
 * @return { Number }
 */
function toNum (str, defaultValue = 0, minValue = Number.NEGATIVE_INFINITY, maxValue = Number.POSITIVE_INFINITY) {
  const val = parseFloat(str)

  if (Number.isNaN(val)) { return defaultValue }

  return Math.max(minValue, Math.min(maxValue, val))
}

/**
 * Convert a comma/space separated string of numbers into an array of numbers
 *
 * @param { String } str The string to convert
 * @param { Number } defaultValue The default value to use if any converted number is NaN
 * @param { Number } minValue Clamp all converted numbers to that minimum value
 * @param { Number } maxValue Clamp all converted numbers to that maximum value
 * @return { Array<Number> }
 */
function toNumList (str, defaultValue = 0, minValue = Number.NEGATIVE_INFINITY, maxValue = Number.POSITIVE_INFINITY) {
  return String(str).split(/[\s,]+/).map(str => toNum(str, defaultValue, minValue, maxValue))
}

// ----------------------------------------------------------------------------
// COORDINATES CONVERSION
// ----------------------------------------------------------------------------

/**
 * Turn a polar coordinate into a cartesian coordinate
 *
 * @param { Number } radius The radial part of a polar coordinate
 * @param { Number } angle The angular part of a polar coordinate
 * @param { Number } baseX A cartesian x translation to apply to the center of origin for the polar coordinate system
 * @param { Number } baseY A cartesian y translation to apply to the center of origin for the polar coordinate system
 * @return { Object:x,y }
 */
function toCartesian (radius, angle, baseX=0, baseY=0) {
  return {
    x: baseX + radius * Math.cos(angle),
    y: baseY + radius * Math.sin(angle)
  }
}

/**
 * Turn a cartesian coordinate into a polar coordinate
 *
 * @param { Number } x The x component of a cartesian coordinate
 * @param { Number } y The y component of a cartesian coordinate
 * @param { Number } baseX A cartesian x translation to apply to the center of origin for the cartesian coordinate system
 * @param { Number } baseY A cartesian y translation to apply to the center of origin for the cartesian coordinate system
 * @return { Object:x,y }
 */
function toPolard (x, y, baseX=0, baseY=0) {
  x = baseX - x
  y = baseY - y

  const radius = Math.sqrt(Math.pow(x) + Math.pow(y))
  const theta  = Math.atan2(y, x)

  return { radius, theta }
}

// ----------------------------------------------------------------------------
// Expose those functions as a module:
// ----------------------------------------------------------------------------
export { toNum, toNumList, toCartesian, toPolard }
