import slice from '../src/array-slice-x';

const itHasDoc = typeof document !== 'undefined' && document ? it : xit;

describe('slice', function() {
  it('exports a function', function() {
    expect.assertions(1);
    expect(typeof slice).toBe('function');
  });

  it('with 1 arg returns an array of the arg', function() {
    expect.assertions(4);
    const o = [3, '4', {}];
    const r = slice(o);
    expect(r).toHaveLength(3);
    expect(r[0]).toBe(o[0]);
    expect(r[1]).toBe(o[1]);
    expect(r[2]).toBe(o[2]);
  });

  it('with 2 args returns an array of the arg starting at the 2nd arg', function() {
    expect.assertions(3);
    const o = [3, '4', 5, null];
    const r = slice(o, 2);
    expect(r).toHaveLength(2);
    expect(r[0]).toBe(o[2]);
    expect(r[1]).toBe(o[3]);
  });

  it('with 3 args returns an array of the arg from the 2nd to the 3rd arg', function() {
    expect.assertions(2);
    const o = [3, '4', 5, null];
    const r = slice(o, 1, 2);
    expect(r).toHaveLength(1);
    expect(r[0]).toBe(o[1]);
  });

  it('begins at an offset from the end and includes all following elements', function() {
    expect.assertions(8);
    const o = [3, '4', 5, null];
    let r = slice(o, -2);
    expect(r).toHaveLength(2);
    expect(r[0]).toBe(o[2]);
    expect(r[1]).toBe(o[3]);

    r = slice(o, -12);
    expect(r).toHaveLength(4);
    expect(r[0]).toBe(o[0]);
    expect(r[1]).toBe(o[1]);
    expect(r[2]).toBe(o[2]);
    expect(r[3]).toBe(o[3]);
  });

  it('begins at an offset from the end and includes `end` elements', function() {
    expect.assertions(4);
    const o = [3, '4', {x: 1}, null];

    let r = slice(o, -2, 1);
    expect(r).toHaveLength(0);

    r = slice(o, -2, 2);
    expect(r).toHaveLength(0);

    r = slice(o, -2, 3);
    expect(r).toHaveLength(1);
    expect(r[0]).toBe(o[2]);
  });

  it('begins at `start` offset from the end and includes all elements up to `end` offset from the end', function() {
    expect.assertions(5);
    const o = [3, '4', {x: 1}, null];
    let r = slice(o, -3, -1);
    expect(r).toHaveLength(2);
    expect(r[0]).toBe(o[1]);
    expect(r[1]).toBe(o[2]);

    r = slice(o, -3, -3);
    expect(r).toHaveLength(0);

    r = slice(o, -3, -4);
    expect(r).toHaveLength(0);
  });

  it('works with arguments', function() {
    expect.assertions(5);
    const o = (function() {
      return arguments;
    })(3, '4', {x: 1}, null);

    let r = slice(o, -3, -1);
    expect(r).toHaveLength(2);
    expect(r[0]).toBe(o[1]);
    expect(r[1]).toBe(o[2]);

    r = slice(o, -3, -3);
    expect(r).toHaveLength(0);

    r = slice(o, -3, -4);
    expect(r).toHaveLength(0);
  });

  it('works with strings', function() {
    expect.assertions(5);
    const o = 'abcd';
    let r = slice(o, -3, -1);
    expect(r).toHaveLength(2);
    expect(r[0]).toBe(o.charAt(1));
    expect(r[1]).toBe(o.charAt(2));

    r = slice(o, -3, -3);
    expect(r).toHaveLength(0);

    r = slice(o, -3, -4);
    expect(r).toHaveLength(0);
  });

  it('works with array-like', function() {
    expect.assertions(5);
    const o = {
      0: 3,
      1: '4',
      2: {x: 1},
      3: null,
      length: 4,
    };

    let r = slice(o, -3, -1);
    expect(r).toHaveLength(2);
    expect(r[0]).toBe(o[1]);
    expect(r[1]).toBe(o[2]);

    r = slice(o, -3, -3);
    expect(r).toHaveLength(0);

    r = slice(o, -3, -4);
    expect(r).toHaveLength(0);
  });

  it('works with sparse arrays', function() {
    expect.assertions(2);
    const o = new Array(6);
    o[0] = 3;
    o[2] = '4';
    o[4] = {x: 1};
    o[5] = null;

    const r = slice(o);
    expect(r).not.toBe(o);
    expect(r).toStrictEqual(o);
  });

  itHasDoc('works with DOM nodes', function() {
    expect.assertions(1);
    const fragment = document.createDocumentFragment();
    const expectedDOM = new Array(5).fill().map(function() {
      const div = document.createElement('div');
      fragment.appendChild(div);

      return div;
    });

    expect(slice(fragment.childNodes)).toStrictEqual(expectedDOM);
  });
});
