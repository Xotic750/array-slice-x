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

describe('slice', function () {
  it('exports a function', function () {
    expect(typeof slice).toBe('function');
  });

  describe('with 1 arg', function () {
    it('returns an array of the arg', function () {
      var o = [3, '4', {}];
      var r = slice(o);
      expect(r.length).toBe(3);
      expect(r[0]).toBe(o[0]);
      expect(r[1]).toBe(o[1]);
      expect(r[2]).toBe(o[2]);
    });
  });

  describe('with 2 args', function () {
    it('returns an array of the arg starting at the 2nd arg', function () {
      var o = [3, '4', 5, null];
      var r = slice(o, 2);
      expect(r.length).toBe(2);
      expect(r[0]).toBe(o[2]);
      expect(r[1]).toBe(o[3]);
    });
  });

  describe('with 3 args', function () {
    it('returns an array of the arg from the 2nd to the 3rd arg', function () {
      var o = [3, '4', 5, null];
      var r = slice(o, 1, 2);
      expect(r.length).toBe(1);
      expect(r[0]).toBe(o[1]);
    });
  });

  describe('with negative start and no end', function () {
    it('begins at an offset from the end and includes all following elements', function () {
      var o = [3, '4', 5, null];
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
  });

  describe('with negative start and positive end', function () {
    it('begins at an offset from the end and includes `end` elements', function () {
      var o = [3, '4', { x: 1 }, null];

      var r = slice(o, -2, 1);
      expect(r.length).toBe(0);

      r = slice(o, -2, 2);
      expect(r.length).toBe(0);

      r = slice(o, -2, 3);
      expect(r.length).toBe(1);
      expect(r[0]).toBe(o[2]);
    });
  });

  describe('with negative start and negative end', function () {
    it('begins at `start` offset from the end and includes all elements up to `end` offset from the end', function () {
      var o = [3, '4', { x: 1 }, null];
      var r = slice(o, -3, -1);
      expect(r.length).toBe(2);
      expect(r[0]).toBe(o[1]);
      expect(r[1]).toBe(o[2]);

      r = slice(o, -3, -3);
      expect(r.length).toBe(0);

      r = slice(o, -3, -4);
      expect(r.length).toBe(0);
    });
  });

});
