import { InvalidPolynomialError } from '../../errors/InvalidPolynomialError.js'
import { Rational } from '../value-objects/Rational.js'

export class RationalRootTheorem {
  findCandidates(polynomial) {
    if (!polynomial.leadingCoefficient.isInteger || !polynomial.constantTerm.isInteger) {
      throw new InvalidPolynomialError('El teorema de ceros racionales requiere coeficientes enteros.')
    }

    if (polynomial.constantTerm.isZero) return [Rational.zero()]

    const numeratorDivisors = this.#positiveDivisors(polynomial.constantTerm.numerator)
    const denominatorDivisors = this.#positiveDivisors(polynomial.leadingCoefficient.numerator)
    const candidates = new Map()

    for (const numerator of numeratorDivisors) {
      for (const denominator of denominatorDivisors) {
        for (const sign of [1n, -1n]) {
          const candidate = new Rational(numerator * sign, denominator)
          candidates.set(candidate.toString(), candidate)
        }
      }
    }

    return [...candidates.values()].sort((first, second) => first.toNumber() - second.toNumber())
  }

  divisorsOf(value) {
    return this.#positiveDivisors(Rational.from(value).numerator)
  }

  #positiveDivisors(value) {
    const absoluteValue = value < 0n ? -value : value
    if (absoluteValue === 0n) return [0n]

    const divisors = []
    for (let divisor = 1n; divisor * divisor <= absoluteValue; divisor += 1n) {
      if (absoluteValue % divisor !== 0n) continue
      divisors.push(divisor)
      const pairedDivisor = absoluteValue / divisor
      if (pairedDivisor !== divisor) divisors.push(pairedDivisor)
    }

    return divisors.sort((first, second) => Number(first - second))
  }
}
