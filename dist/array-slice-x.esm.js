import toObject from 'to-object-x';
import isArguments from 'is-arguments';
import isArray from 'is-array-x';
import arrayLikeSlice from 'array-like-slice-x';
import attempt from 'attempt-x';
import isString from 'is-string';
var nativeSlice = [].slice;

var testArray = function testArray() {
  var res = attempt.call([1, 2, 3], nativeSlice, 1, 2);
  return res.threw || isArray(res.value) === false || res.value.length !== 1 || res.value[0] !== 2;
};

var testString = function testString() {
  var res = attempt.call('abc', nativeSlice, 1, 2);
  return res.threw || isArray(res.value) === false || res.value.length !== 1 || res.value[0] !== 'b';
};

var testDOM = function testDOM() {
  var doc = typeof document !== 'undefined' && document;
  var resultDocElement = doc ? attempt.call(doc.documentElement, nativeSlice).threw : false;
  return resultDocElement ? resultDocElement.threw : false;
};

var failArray = testArray();
var failString = testString();
var failDOM = testDOM();
/**
 * The slice() method returns a shallow copy of a portion of an array into a new
 * array object selected from begin to end (end not included). The original
 * array will not be modified.
 *
 * @param {Array|object} array - The array to slice.
 * @param {number} [start] - Zero-based index at which to begin extraction.
 *  A negative index can be used, indicating an offset from the end of the
 *  sequence. Running slice(-2) extracts the last two elements in the sequence.
 *  If begin is undefined, slice begins from index 0.
 * @param {number} [end] - Zero-based index before which to end extraction.
 *  Slice extracts up to but not including end. For example, slice(1,4)
 *  extracts the second element through the fourth element (elements indexed
 *  1, 2, and 3).
 *  A negative index can be used, indicating an offset from the end of the
 *  sequence. Running slice(2,-1) extracts the third element through the second-to-last
 *  element in the sequence.
 *  If end is omitted, slice extracts through the end of the
 *  sequence (arr.length).
 *  If end is greater than the length of the sequence, slice extracts through
 *  the end of the sequence (arr.length).
 * @returns {Array} A new array containing the extracted elements.
 */

var slice = function slice(array, start, end) {
  var object = toObject(array);

  if (failArray || failDOM && isArray(object) === false || failString && isString(object) || isArguments(object)) {
    return arrayLikeSlice(object, start, end);
  }
  /* eslint-disable-next-line prefer-rest-params */


  return nativeSlice.apply(object, arrayLikeSlice(arguments, 1));
};

export default slice;

//# sourceMappingURL=array-slice-x.esm.js.map