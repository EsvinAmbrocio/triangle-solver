import { InvalidPolynomialError } from '../../errors/InvalidPolynomialError.js'
import { Rational } from '../value-objects/Rational.js'

export class QuadraticSolver {
  solve(polynomial) {
    if (polynomial.degree !== 2) {
      throw new InvalidPolynomialError('La fórmula cuadrática requiere un polinomio de grado 2.')
    }

    const [a, b, c] = polynomial.coefficients
    const discriminant = b.multiply(b).subtract(a.multiply(c).multiply(4))
    const denominator = a.multiply(2)
    const oppositeB = b.negate()

    if (discriminant.isZero) {
      const root = oppositeB.divide(denominator)
      return Object.freeze({
        discriminant,
        nature: 'double-real',
        roots: Object.freeze([this.#rationalRoot(root, 2)]),
      })
    }

    if (discriminant.sign > 0) {
      const exactSquareRoot = this.#exactSquareRoot(discriminant)
      if (exactSquareRoot) {
        return Object.freeze({
          discriminant,
          nature: 'two-real',
          roots: Object.freeze([
            this.#rationalRoot(oppositeB.add(exactSquareRoot).divide(denominator)),
            this.#rationalRoot(oppositeB.subtract(exactSquareRoot).divide(denominator)),
          ]),
        })
      }

      const squareRoot = Math.sqrt(discriminant.toNumber())
      const divisor = denominator.toNumber()
      return Object.freeze({
        discriminant,
        nature: 'two-real',
        roots: Object.freeze([
          this.#irrationalRealRoot((oppositeB.toNumber() + squareRoot) / divisor, oppositeB, discriminant, denominator, '+'),
          this.#irrationalRealRoot((oppositeB.toNumber() - squareRoot) / divisor, oppositeB, discriminant, denominator, '-'),
        ]),
      })
    }

    const realPart = oppositeB.toNumber() / denominator.toNumber()
    const imaginaryPart = Math.sqrt(discriminant.negate().toNumber()) / Math.abs(denominator.toNumber())
    return Object.freeze({
      discriminant,
      nature: 'two-complex',
      roots: Object.freeze([
        this.#complexRoot(realPart, imaginaryPart, oppositeB, discriminant.negate(), denominator, '+'),
        this.#complexRoot(realPart, -imaginaryPart, oppositeB, discriminant.negate(), denominator, '-'),
      ]),
    })
  }

  #rationalRoot(value, multiplicity = 1) {
    return Object.freeze({ type: 'real', exact: value, approximate: value.toNumber(), multiplicity })
  }

  #irrationalRealRoot(approximate, oppositeB, discriminant, denominator, sign) {
    return Object.freeze({
      type: 'real',
      exactLatex: `\\frac{${oppositeB.toLatex()}${sign}\\sqrt{${discriminant.toLatex()}}}{${denominator.toLatex()}}`,
      approximate,
      multiplicity: 1,
    })
  }

  #complexRoot(real, imaginary, oppositeB, positiveDiscriminant, denominator, sign) {
    return Object.freeze({
      type: 'complex',
      exactLatex: `\\frac{${oppositeB.toLatex()}${sign}i\\sqrt{${positiveDiscriminant.toLatex()}}}{${denominator.toLatex()}}`,
      real,
      imaginary,
      multiplicity: 1,
    })
  }

  #exactSquareRoot(value) {
    const numeratorRoot = this.#integerSquareRoot(value.numerator)
    const denominatorRoot = this.#integerSquareRoot(value.denominator)
    if (numeratorRoot === null || denominatorRoot === null) return null
    return new Rational(numeratorRoot, denominatorRoot)
  }

  #integerSquareRoot(value) {
    if (value < 0n) return null
    if (value < 2n) return value

    let current = value
    let next = (current + value / current) / 2n
    while (next < current) {
      current = next
      next = (current + value / current) / 2n
    }
    return current * current === value ? current : null
  }
}
