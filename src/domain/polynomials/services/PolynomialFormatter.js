import { Rational } from '../value-objects/Rational.js'

export class PolynomialFormatter {
  toLatex(polynomial, variable = 'x') {
    const terms = []

    polynomial.coefficients.forEach((coefficient, index) => {
      if (coefficient.isZero) return

      const exponent = polynomial.degree - index
      const sign = coefficient.sign < 0 ? '-' : '+'
      const absolute = coefficient.absolute()
      const coefficientText = exponent > 0 && absolute.equals(Rational.one())
        ? ''
        : absolute.toLatex()
      const variableText = exponent === 0
        ? ''
        : exponent === 1 ? variable : `${variable}^{${exponent}}`
      terms.push({ sign, content: `${coefficientText}${variableText}` })
    })

    if (terms.length === 0) return '0'

    return terms.map(({ sign, content }, index) => {
      if (index === 0) return sign === '-' ? `-${content}` : content
      return `${sign}${content}`
    }).join('')
  }

  rootToFactor(root) {
    if (root.isZero) return 'x'
    return root.sign < 0
      ? `\\left(x+${root.absolute().toLatex()}\\right)`
      : `\\left(x-${root.toLatex()}\\right)`
  }
}
