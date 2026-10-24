import { InvalidPolynomialError } from '../../errors/InvalidPolynomialError.js'
import { Polynomial } from '../entities/Polynomial.js'
import { Rational } from '../value-objects/Rational.js'

export class SyntheticDivision {
  divide(polynomial, candidate) {
    if (polynomial.degree < 1) {
      throw new InvalidPolynomialError('No se puede dividir sintéticamente un polinomio constante.')
    }

    const root = Rational.from(candidate)
    const sums = [polynomial.coefficients[0]]
    const products = []

    for (let index = 1; index < polynomial.coefficients.length; index += 1) {
      const product = sums[sums.length - 1].multiply(root)
      products.push(product)
      sums.push(polynomial.coefficients[index].add(product))
    }

    const remainder = sums[sums.length - 1]
    const quotient = new Polynomial(sums.slice(0, -1))

    return Object.freeze({
      candidate: root,
      originalCoefficients: polynomial.coefficients,
      products: Object.freeze(products),
      sums: Object.freeze(sums),
      quotient,
      remainder,
      isRoot: remainder.isZero,
    })
  }
}
