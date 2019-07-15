import toObject from 'to-object-x';
import isArguments from 'is-arguments';
import isArray from 'is-array-x';
import arrayLikeSlice from 'array-like-slice-x';
import attempt from 'attempt-x';
import isString from 'is-string';

const nativeSlice = [].slice;

const resultArray = nativeSlice ? attempt.call([1, 2, 3], nativeSlice, 1, 2) : null;
const failArray = resultArray
  ? resultArray.threw || isArray(resultArray.value) === false || resultArray.value.length !== 1 || resultArray.value[0] !== 2
  : false;

const resultString = nativeSlice ? attempt.call('abc', nativeSlice, 1, 2) : null;
const failString = resultString
  ? resultString.threw ||
    isArray(resultString.value) === false ||
    resultString.value.length !== 1 ||
    resultString.value[0] !== 'b'
  : false;

const doc = typeof document !== 'undefined' && document;
const resultDocElement = nativeSlice && doc ? attempt.call(doc.documentElement, nativeSlice).threw : null;
const failDOM = resultDocElement ? resultDocElement.threw : false;

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
export default function slice(array, start, end) {
  const object = toObject(array);

  if (failArray || (failDOM && isArray(object) === false) || (failString && isString(object)) || isArguments(object)) {
    return arrayLikeSlice(object, start, end);
  }

  /* eslint-disable-next-line prefer-rest-params */
  return nativeSlice.apply(object, arrayLikeSlice(arguments, 1));
}
