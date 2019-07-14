/**
 * @file Cross-browser array slicer.
 * @version 3.5.0.
 * @author Xotic750 <Xotic750@gmail.com>.
 * @copyright  Xotic750.
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module Array-slice-x.
 */

const toObject = require('to-object-x');
const isArguments = require('is-arguments');
const isArray = require('is-array-x');
const arrayLikeSlice = require('array-like-slice-x');
const nativeSlice = require('cached-constructors-x').Array.prototype.slice;

let isString;
let failArr;
let failDOM;

if (nativeSlice) {
  const attempt = require('attempt-x');
  let res = attempt.call([1, 2, 3], nativeSlice, 1, 2);

  failArr = res.threw || isArray(res.value) === false || res.value.length !== 1 || res.value[0] !== 2;

  if (failArr === false) {
    res = attempt.call('abc', nativeSlice, 1, 2);
    isString = (res.threw || res.value.length !== 1 || res.value[0] !== 'b') && require('is-string');
    const doc = typeof document !== 'undefined' && document;
    failDOM = doc && attempt.call(doc.documentElement, nativeSlice).threw;
  }
} else {
  failArr = true;
}

/**
 * The slice() method returns a shallow copy of a portion of an array into a new
 * array object selected from begin to end (end not included). The original
 * array will not be modified.
 *
 * @param {Array|object} array - The array to slice.
 * @param {number} [start] - Zero-based index at which to begin extraction.
 *  A negative index can be used, indicating an offset from the end of the
 *  sequence. slice(-2) extracts the last two elements in the sequence.
 *  If begin is undefined, slice begins from index 0.
 * @param {number} [end] - Zero-based index before which to end extraction.
 *  Slice extracts up to but not including end. For example, slice(1,4)
 *  extracts the second element through the fourth element (elements indexed
 *  1, 2, and 3).
 *  A negative index can be used, indicating an offset from the end of the
 *  sequence. slice(2,-1) extracts the third element through the second-to-last
 *  element in the sequence.
 *  If end is omitted, slice extracts through the end of the
 *  sequence (arr.length).
 *  If end is greater than the length of the sequence, slice extracts through
 *  the end of the sequence (arr.length).
 * @returns {Array} A new array containing the extracted elements.
 * @example
 * var slice = require('array-slice-x');
 * var fruits = ['Banana', 'Orange', 'Lemon', 'Apple', 'Mango'];
 * var citrus = slice(fruits, 1, 3);
 *
 * // fruits contains ['Banana', 'Orange', 'Lemon', 'Apple', 'Mango']
 * // citrus contains ['Orange','Lemon']
 */
module.exports = function slice(array, start, end) {
  const object = toObject(array);

  if (failArr || (failDOM && isArray(object) === false) || (isString && isString(object)) || isArguments(object)) {
    return arrayLikeSlice(object, start, end);
  }

  return nativeSlice.apply(object, arrayLikeSlice(arguments, 1));
};
