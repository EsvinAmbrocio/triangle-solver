import { describe, expect, it } from 'vitest'
import { InvalidPolynomialError } from '../../../src/domain/errors/InvalidPolynomialError.js'
import { Polynomial } from '../../../src/domain/polynomials/entities/Polynomial.js'
import { Rational } from '../../../src/domain/polynomials/value-objects/Rational.js'

describe('Polynomial', () => {
  it('creates an immutable degree-five polynomial from integer coefficients', () => {
    const polynomial = Polynomial.fromInput([2, -5, 5, 15, -47, 30])

    expect(polynomial.degree).toBe(5)
    expect(polynomial.leadingCoefficient.toString()).toBe('2')
    expect(polynomial.constantTerm.toString()).toBe('30')
    expect(Object.isFrozen(polynomial)).toBe(true)
    expect(Object.isFrozen(polynomial.coefficients)).toBe(true)
  })

  it('evaluates a polynomial exactly with Horner method', () => {
    const polynomial = Polynomial.fromInput([2, -3, 1])

    expect(polynomial.evaluate(new Rational(1, 2)).isZero).toBe(true)
    expect(polynomial.evaluate(1).isZero).toBe(true)
  })

  it('rejects an invalid leading coefficient and unsupported degrees', () => {
    expect(() => Polynomial.fromInput([0, 2, 1])).toThrow(InvalidPolynomialError)
    expect(() => Polynomial.fromInput([2, 1])).toThrow(InvalidPolynomialError)
    expect(() => Polynomial.fromInput([1, 2, 3, 4, 5, 6, 7])).toThrow(InvalidPolynomialError)
  })

  it('rejects non-integer input coefficients', () => {
    expect(() => Polynomial.fromInput([1, 1.5, 2])).toThrow(InvalidPolynomialError)
    expect(() => Polynomial.fromInput([new Rational(1, 2), 1, 2])).toThrow(InvalidPolynomialError)
  })
})
