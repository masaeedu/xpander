const { describe, it } = require('mocha')
const assert = require('assert')
const { expand, interpolate } = require('.')

describe('expand', () => {
    it(`should expand a primitive into a single-element array`, () => {
        assert.deepEqual(
            expand('foo'),
            ['foo']
        )
    })

    it(`should expand a nested array into a flattened array`, () => {
        assert.deepEqual(
            expand(['foo', ['bar', 'baz']]),
            ['foo', 'bar', 'baz']
        )
    })

    it(`should expand an object containing arrays into an array containing objects`, () => {
        assert.deepEqual(
            expand({ a: ['b', 'c'] }),
            [{ a: 'b' }, { a: 'c' }]
        )
    })

    it(`should expand an object containing arrays according to their cartesian product`, () => {
        assert.deepEqual(
            expand({ a: ['b', 'c'], d: ['e', 'f'] }),
            [{ a: 'b', d: 'e' }, { a: 'b', d: 'f' }, { a: 'c', d: 'e' }, { a: 'c', d: 'f' }]
        )
    })

    it(`should expand objects containing object values recursively`, () => {
        assert.deepEqual(
            expand({ a: { b: ['c', 'd'] } }),
            [{ a: { b: 'c' } }, { a: { b: 'd' } }]
        )
    })

    it(`should expand "." properties directly into their parent objects`, () => {
        assert.deepEqual(
            expand({ a: 'b', '.': [{ c: 'd' }, { e: 'f' }] }),
            [{ a: 'b', c: 'd' }, { a: 'b', e: 'f' }]
        )
    })

    it(`should overwrite parent properties with dot-expanded child-properties`, () => {
        assert.deepEqual(
            expand({ a: 'foo', '.': [{ a: 'bar', b: 1 }, { b: 2 }] }),
            [{ a: 'bar', b: 1 }, { a: 'foo', b: 2 }]
        )
    })
})

describe('interpolate', () => {
    it(`should interpolate references to an object's properties into any template strings it contains`, () => {
        assert.deepEqual(
            interpolate({ a: 'b', c: '{a} and {d.e}', d: { e: 'f' } }),
            { a: 'b', c: 'b and f', d: { e: 'f' } }
        )
    })

    it(`should interpolate recursively`, () => {
        assert.deepEqual(
            interpolate({ a: 'a and {b}', b: 'b and {c}', c: 'c' }),
            { a: 'a and b and c', b: 'b and c', c: 'c' }
        )
    })
})
