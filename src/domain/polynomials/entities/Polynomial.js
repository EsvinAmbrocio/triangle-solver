import { InvalidPolynomialError } from '../../errors/InvalidPolynomialError.js'
import { InvalidRationalError } from '../../errors/InvalidRationalError.js'
import { Rational } from '../value-objects/Rational.js'

const MAXIMUM_SUPPORTED_DEGREE = 5
const MINIMUM_INPUT_DEGREE = 2

export class Polynomial {
  #coefficients

  constructor(coefficients) {
    if (!Array.isArray(coefficients) || coefficients.length === 0) {
      throw new InvalidPolynomialError('El polinomio debe contener coeficientes.')
    }

    if (coefficients.length - 1 > MAXIMUM_SUPPORTED_DEGREE) {
      throw new InvalidPolynomialError('El grado máximo permitido es 5.')
    }

    this.#coefficients = Object.freeze(coefficients.map((coefficient, index) => {
      try {
        return Rational.from(coefficient)
      } catch (error) {
        if (error instanceof InvalidRationalError) {
          throw new InvalidPolynomialError(
            'Cada coeficiente debe ser un número entero válido.',
            `coefficients.${index}`,
          )
        }
        throw error
      }
    }))

    if (this.#coefficients[0].isZero) {
      throw new InvalidPolynomialError(
        'El coeficiente principal no puede ser cero.',
        'coefficients.0',
      )
    }

    Object.freeze(this)
  }

  static fromInput(coefficients) {
    const polynomial = new Polynomial(coefficients)

    if (polynomial.degree < MINIMUM_INPUT_DEGREE) {
      throw new InvalidPolynomialError('El grado mínimo permitido es 2.')
    }

    const nonIntegerIndex = polynomial.coefficients.findIndex((coefficient) => !coefficient.isInteger)
    if (nonIntegerIndex >= 0) {
      throw new InvalidPolynomialError(
        'Los coeficientes de entrada deben ser enteros.',
        `coefficients.${nonIntegerIndex}`,
      )
    }

    return polynomial
  }

  get coefficients() {
    return this.#coefficients
  }

  get degree() {
    return this.#coefficients.length - 1
  }

  get leadingCoefficient() {
    return this.#coefficients[0]
  }

  get constantTerm() {
    return this.#coefficients[this.#coefficients.length - 1]
  }

  evaluate(value) {
    const input = Rational.from(value)
    return this.#coefficients.reduce(
      (result, coefficient) => result.multiply(input).add(coefficient),
      Rational.zero(),
    )
  }

  toNumberArray() {
    return this.#coefficients.map((coefficient) => coefficient.toNumber())
  }
}
