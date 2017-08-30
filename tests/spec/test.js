'use strict';

var slice;
if (typeof module === 'object' && module.exports) {
  require('es5-shim');
  require('es5-shim/es5-sham');
  if (typeof JSON === 'undefined') {
    JSON = {};
  }
  require('json3').runInContext(null, JSON);
  require('es6-shim');
  var es7 = require('es7-shim');
  Object.keys(es7).forEach(function (key) {
    var obj = es7[key];
    if (typeof obj.shim === 'function') {
      obj.shim();
    }
  });
  slice = require('../../index.js');
} else {
  slice = returnExports;
}

var documentElement = typeof document !== 'undefined' && document.documentElement;
var itHasDocumentElement = documentElement ? it : xit;

describe('slice', function () {
  it('exports a function', function () {
    expect(typeof slice).toBe('function');
  });

  it('with 1 arg returns an array of the arg', function () {
    var o = [
      3,
      '4',
      {}
    ];
    var r = slice(o);
    expect(r.length).toBe(3);
    expect(r[0]).toBe(o[0]);
    expect(r[1]).toBe(o[1]);
    expect(r[2]).toBe(o[2]);
  });

  it('with 2 args returns an array of the arg starting at the 2nd arg', function () {
    var o = [
      3,
      '4',
      5,
      null
    ];
    var r = slice(o, 2);
    expect(r.length).toBe(2);
    expect(r[0]).toBe(o[2]);
    expect(r[1]).toBe(o[3]);
  });

  it('with 3 args returns an array of the arg from the 2nd to the 3rd arg', function () {
    var o = [
      3,
      '4',
      5,
      null
    ];
    var r = slice(o, 1, 2);
    expect(r.length).toBe(1);
    expect(r[0]).toBe(o[1]);
  });

  it('begins at an offset from the end and includes all following elements', function () {
    var o = [
      3,
      '4',
      5,
      null
    ];
    var r = slice(o, -2);
    expect(r.length).toBe(2);
    expect(r[0]).toBe(o[2]);
    expect(r[1]).toBe(o[3]);

    r = slice(o, -12);
    expect(r.length).toBe(4);
    expect(r[0]).toBe(o[0]);
    expect(r[1]).toBe(o[1]);
    expect(r[2]).toBe(o[2]);
    expect(r[3]).toBe(o[3]);
  });

  it('begins at an offset from the end and includes `end` elements', function () {
    var o = [
      3,
      '4',
      { x: 1 },
      null
    ];

    var r = slice(o, -2, 1);
    expect(r.length).toBe(0);

    r = slice(o, -2, 2);
    expect(r.length).toBe(0);

    r = slice(o, -2, 3);
    expect(r.length).toBe(1);
    expect(r[0]).toBe(o[2]);
  });

  it('begins at `start` offset from the end and includes all elements up to `end` offset from the end', function () {
    var o = [
      3,
      '4',
      { x: 1 },
      null
    ];
    var r = slice(o, -3, -1);
    expect(r.length).toBe(2);
    expect(r[0]).toBe(o[1]);
    expect(r[1]).toBe(o[2]);

    r = slice(o, -3, -3);
    expect(r.length).toBe(0);

    r = slice(o, -3, -4);
    expect(r.length).toBe(0);
  });

  it('works with arguments', function () {
    var o = (function () {
      return arguments;
    }(3, '4', { x: 1 }, null));

    var r = slice(o, -3, -1);
    expect(r.length).toBe(2);
    expect(r[0]).toBe(o[1]);
    expect(r[1]).toBe(o[2]);

    r = slice(o, -3, -3);
    expect(r.length).toBe(0);

    r = slice(o, -3, -4);
    expect(r.length).toBe(0);
  });

  it('works with strings', function () {
    var o = 'abcd';
    var r = slice(o, -3, -1);
    expect(r.length).toBe(2);
    expect(r[0]).toBe(o.charAt(1));
    expect(r[1]).toBe(o.charAt(2));

    r = slice(o, -3, -3);
    expect(r.length).toBe(0);

    r = slice(o, -3, -4);
    expect(r.length).toBe(0);
  });

  it('works with array-like', function () {
    var o = {
      0: 3,
      1: '4',
      2: { x: 1 },
      3: null,
      length: 4
    };

    var r = slice(o, -3, -1);
    expect(r.length).toBe(2);
    expect(r[0]).toBe(o[1]);
    expect(r[1]).toBe(o[2]);

    r = slice(o, -3, -3);
    expect(r.length).toBe(0);

    r = slice(o, -3, -4);
    expect(r.length).toBe(0);
  });

  it('works with sparse arrays', function () {
    var o = new Array(6);
    o[0] = 3;
    o[2] = '4';
    o[4] = { x: 1 };
    o[5] = null;

    var r = slice(o);
    expect(r).not.toBe(o);
    expect(r).toEqual(o);
  });

  itHasDocumentElement('works with DOM nodes', function () {
    var fragment = document.createDocumentFragment();
    var expectedDOM = new Array(5).fill().map(function () {
      var div = document.createElement('div');
      fragment.appendChild(div);
      return div;
    });

    expect(slice(fragment.childNodes)).toEqual(expectedDOM);

  });
});
