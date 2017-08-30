/**
 * @file Cross-browser array slicer.
 * @version 3.0.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module array-slice-x
 */

'use strict';

var toObject = require('to-object-x');
var toInteger = require('to-integer-x');
var toLength = require('to-length-x');
var isUndefined = require('validate.io-undefined');
var isString = require('is-string');
var splitString = require('has-boxed-string-x') === false;
var isArguments = require('is-arguments');
var nativeSlice = Array.prototype.slice;

var implemented;
var worksWithDOMElements;
if (nativeSlice) {
  try {
    var arr = nativeSlice.call([
      1,
      2,
      3
    ], 1, 2);

    implemented = arr.length === 1 && arr[0] === 2;
  } catch (ignore) {}

  if (implemented) {
    try {
      // Can't be used with DOM elements in IE < 9
      nativeSlice.call(document.documentElement);
      worksWithDOMElements = true;
    } catch (ignore) {}
  }
}

var hasArgumentsLengthBug = (function () {
  return arguments.length !== 1;
}(1));

var argsToArray;
if (hasArgumentsLengthBug) {
  var isDigits = function _isDigits(key) {
    return (/^\d+$/).test(key);
  };

  argsToArray = function _argsToArray(args) {
    var array = [];
    // eslint-disable-next-line no-restricted-syntax
    for (var arg in args) {
      if (isDigits(arg)) {
        array[array.length] = arg;
      }
    }

    return array;
  };
}

var setRelative = function _setRelative(value, length) {
  return value < 0 ? Math.max(length + value, 0) : Math.min(value, length);
};

var internalSlice = function _internalSlice(object, start, end) {
  var length = toLength(object.length);
  var k = setRelative(toInteger(start), length);
  var relativeEnd = isUndefined(end) ? length : toInteger(end);
  var finalEnd = setRelative(relativeEnd, length);
  var val = [];
  val.length = Math.max(finalEnd - k, 0);
  var next = 0;
  while (k < finalEnd) {
    if (k in object) {
      val[next] = object[k];
    }

    next += 1;
    k += 1;
  }

  return val;
};

/**
 * The slice() method returns a shallow copy of a portion of an array into a new
 * array object selected from begin to end (end not included). The original
 * array will not be modified.
 *
 * @param {Array|Object} array - The array to slice.
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
  var object = toObject(array);
  var iterable;

  if (isArguments(object)) {
    iterable = argsToArray ? argsToArray(object) : object;
    return internalSlice(iterable, start, end);
  }

  iterable = splitString && isString(object) ? object.split('') : object;
  if (implemented !== true || worksWithDOMElements !== true) {
    return internalSlice(iterable, start, end);
  }

  return nativeSlice.apply(iterable, internalSlice(arguments, 1));
};
