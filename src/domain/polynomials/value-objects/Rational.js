import { InvalidRationalError } from '../../errors/InvalidRationalError.js'

export class Rational {
  #numerator
  #denominator

  constructor(numerator, denominator = 1) {
    const parsedNumerator = Rational.#toBigInt(numerator)
    const parsedDenominator = Rational.#toBigInt(denominator)

    if (parsedDenominator === 0n) {
      throw new InvalidRationalError('El denominador no puede ser cero.')
    }

    const sign = parsedDenominator < 0n ? -1n : 1n
    const divisor = Rational.#greatestCommonDivisor(parsedNumerator, parsedDenominator)

    this.#numerator = parsedNumerator / divisor * sign
    this.#denominator = Rational.#absolute(parsedDenominator) / divisor
    Object.freeze(this)
  }

  static from(value) {
    return value instanceof Rational ? value : new Rational(value)
  }

  static zero() {
    return new Rational(0n)
  }

  static one() {
    return new Rational(1n)
  }

  get numerator() {
    return this.#numerator
  }

  get denominator() {
    return this.#denominator
  }

  get isZero() {
    return this.#numerator === 0n
  }

  get isInteger() {
    return this.#denominator === 1n
  }

  get sign() {
    return this.#numerator === 0n ? 0 : this.#numerator > 0n ? 1 : -1
  }

  add(other) {
    const rational = Rational.from(other)
    return new Rational(
      this.#numerator * rational.denominator + rational.numerator * this.#denominator,
      this.#denominator * rational.denominator,
    )
  }

  subtract(other) {
    return this.add(Rational.from(other).negate())
  }

  multiply(other) {
    const rational = Rational.from(other)
    return new Rational(
      this.#numerator * rational.numerator,
      this.#denominator * rational.denominator,
    )
  }

  divide(other) {
    const rational = Rational.from(other)

    if (rational.isZero) {
      throw new InvalidRationalError('No se puede dividir entre cero.')
    }

    return new Rational(
      this.#numerator * rational.denominator,
      this.#denominator * rational.numerator,
    )
  }

  negate() {
    return new Rational(-this.#numerator, this.#denominator)
  }

  absolute() {
    return new Rational(Rational.#absolute(this.#numerator), this.#denominator)
  }

  equals(other) {
    const rational = Rational.from(other)
    return this.#numerator === rational.numerator
      && this.#denominator === rational.denominator
  }

  compareTo(other) {
    const difference = this.subtract(other)
    return difference.sign
  }

  toNumber() {
    return Number(this.#numerator) / Number(this.#denominator)
  }

  toString() {
    return this.isInteger
      ? this.#numerator.toString()
      : `${this.#numerator}/${this.#denominator}`
  }

  toLatex() {
    return this.isInteger
      ? this.#numerator.toString()
      : `\\frac{${this.#numerator}}{${this.#denominator}}`
  }

  static #toBigInt(value) {
    if (typeof value === 'bigint') return value

    if (typeof value === 'number' && Number.isSafeInteger(value)) {
      return BigInt(value)
    }

    if (typeof value === 'string' && /^[+-]?\d+$/.test(value.trim())) {
      return BigInt(value.trim())
    }

    throw new InvalidRationalError('El numerador y el denominador deben ser enteros.')
  }

  static #greatestCommonDivisor(first, second) {
    let a = Rational.#absolute(first)
    let b = Rational.#absolute(second)

    while (b !== 0n) {
      const remainder = a % b
      a = b
      b = remainder
    }

    return a === 0n ? 1n : a
  }

  static #absolute(value) {
    return value < 0n ? -value : value
  }
}
