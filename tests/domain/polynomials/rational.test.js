import { describe, expect, it } from 'vitest'
import { InvalidRationalError } from '../../../src/domain/errors/InvalidRationalError.js'
import { Rational } from '../../../src/domain/polynomials/value-objects/Rational.js'

describe('Rational', () => {
  it('simplifies fractions and normalizes the denominator sign', () => {
    expect(new Rational(2, 4).toString()).toBe('1/2')
    expect(new Rational(-3, -6).toString()).toBe('1/2')
    expect(new Rational(1, -2).toString()).toBe('-1/2')
  })

  it('performs exact arithmetic', () => {
    const first = new Rational(1, 3)
    const second = new Rational(1, 6)

    expect(first.add(second).equals(new Rational(1, 2))).toBe(true)
    expect(first.subtract(second).equals(new Rational(1, 6))).toBe(true)
    expect(first.multiply(second).equals(new Rational(1, 18))).toBe(true)
    expect(first.divide(second).equals(new Rational(2))).toBe(true)
  })

  it('accepts exact integer strings and rejects decimal values', () => {
    expect(new Rational('-12').toString()).toBe('-12')
    expect(() => new Rational(1.5)).toThrow(InvalidRationalError)
    expect(() => new Rational('1.5')).toThrow(InvalidRationalError)
  })

  it('rejects a zero denominator and division by zero', () => {
    expect(() => new Rational(1, 0)).toThrow(InvalidRationalError)
    expect(() => new Rational(1, 2).divide(0)).toThrow(InvalidRationalError)
  })
})
