import { InvalidPolynomialError } from '../../domain/errors/InvalidPolynomialError.js'
import { Polynomial } from '../../domain/polynomials/entities/Polynomial.js'
import { CalculationProcedure } from '../../domain/procedures/CalculationProcedure.js'
import { CalculationStep } from '../../domain/procedures/CalculationStep.js'

export class PolynomialApplicationService {
  constructor(analyzer, formatter, rationalRootTheorem) {
    this.analyzer = analyzer
    this.formatter = formatter
    this.rationalRootTheorem = rationalRootTheorem
  }

  analyze(coefficients) {
    if (!Array.isArray(coefficients)) {
      throw new InvalidPolynomialError('Los coeficientes no son válidos.')
    }

    const polynomial = Polynomial.fromInput(coefficients)
    const analysis = this.analyzer.analyze(polynomial)
    const factors = analysis.rationalRoots.flatMap(({ value, multiplicity }) => (
      Array.from({ length: multiplicity }, () => this.formatter.rootToFactor(value))
    ))
    return Object.freeze({
      ...analysis,
      polynomialLatex: this.formatter.toLatex(polynomial),
      reducedPolynomialLatex: this.formatter.toLatex(analysis.reducedPolynomial),
      factorsLatex: factors.join('') || '1',
      realRoots: Object.freeze(this.#collectRealRoots(analysis)),
      procedure: this.#createProcedure(analysis),
    })
  }

  #collectRealRoots(analysis) {
    const roots = []
    for (const root of analysis.rationalRoots) {
      for (let count = 0; count < root.multiplicity; count += 1) {
        roots.push(root.value.toNumber())
      }
    }
    for (const root of analysis.quadraticResult?.roots ?? []) {
      if (root.type === 'real') roots.push(root.approximate)
    }
    return roots
  }

  #createProcedure(analysis) {
    const steps = [new CalculationStep({
      title: 'Polinomio original',
      description: `Polinomio de grado ${analysis.originalPolynomial.degree}.`,
      formula: `P(x)=${this.formatter.toLatex(analysis.originalPolynomial)}`,
    })]

    let theoremNumber = 0
    for (const event of analysis.events) {
      if (event.type === 'division') {
        steps.push(this.#divisionStep(event.division))
        continue
      }

      theoremNumber += 1
      const { candidateSet } = event
      const pDivisors = this.rationalRootTheorem.divisorsOf(candidateSet.polynomial.constantTerm)
      const qDivisors = this.rationalRootTheorem.divisorsOf(candidateSet.polynomial.leadingCoefficient)
      steps.push(new CalculationStep({
        title: theoremNumber === 1
          ? 'Buscar la primera raíz racional'
          : `Buscar otra raíz en el polinomio reducido ${theoremNumber}`,
        description: 'Cada vez que aparece una raíz, el grado disminuye y el teorema se aplica nuevamente al cociente.',
        formula: `\\begin{aligned}Q_{${theoremNumber}}(x)&=${this.formatter.toLatex(candidateSet.polynomial)}\\\\p&\\in\\{${pDivisors.join(',')}\\}\\\\q&\\in\\{${qDivisors.join(',')}\\}\\\\\\frac{p}{q}&\\in\\{${candidateSet.candidates.map((candidate) => candidate.toLatex()).join(',')}\\}\\end{aligned}`,
      }))
    }

    const factors = analysis.rationalRoots.flatMap(({ value, multiplicity }) => (
      Array.from({ length: multiplicity }, () => this.formatter.rootToFactor(value))
    ))
    steps.push(new CalculationStep({
      title: 'Polinomio reducido',
      description: analysis.unresolved
        ? 'El polinomio restante no tiene ceros racionales detectables y requiere otro método.'
        : 'Se muestran los factores racionales y el polinomio restante.',
      formula: `P(x)=${factors.join('') || '1'}\\left(${this.formatter.toLatex(analysis.reducedPolynomial)}\\right)`,
    }))

    if (analysis.quadraticResult) {
      steps.push(this.#quadraticStep(analysis))
    }

    return new CalculationProcedure({
      title: 'Análisis del polinomio',
      summary: 'Teorema de ceros racionales, división sintética y resolución del factor restante.',
      steps,
    })
  }

  #divisionStep(attempt) {
    const coefficients = attempt.originalCoefficients.map((value) => value.toLatex()).join('&')
    const products = ['', ...attempt.products.map((value) => value.toLatex())].join('&')
    const sums = attempt.sums.map((value) => value.toLatex()).join('&')
    return new CalculationStep({
      title: `División sintética con r = ${attempt.candidate.toString()}`,
      description: attempt.isRoot
        ? 'El residuo es cero; el candidato es una raíz.'
        : 'El residuo no es cero; el candidato se descarta.',
      formula: `\\begin{array}{c|${'c'.repeat(attempt.originalCoefficients.length)}}${attempt.candidate.toLatex()}&${coefficients}\\\\&${products}\\\\\\hline&${sums}\\end{array}\\qquad R=${attempt.remainder.toLatex()}`,
    })
  }

  #quadraticStep(analysis) {
    const [a, b, c] = analysis.reducedPolynomial.coefficients
    const result = analysis.quadraticResult
    const roots = result.roots.map((root) => {
      if (root.exact) return root.exact.toLatex()
      if (root.type === 'complex') return root.exactLatex
      return `${root.exactLatex}\\approx ${root.approximate.toFixed(4)}`
    }).join(',\\quad ')
    return new CalculationStep({
      title: 'Resolver el factor cuadrático',
      description: result.nature === 'two-complex'
        ? 'El discriminante es negativo; las raíces son complejas conjugadas.'
        : 'Se aplica la fórmula cuadrática al polinomio restante.',
      formula: `\\begin{aligned}a&=${a.toLatex()},\\ b=${b.toLatex()},\\ c=${c.toLatex()}\\\\\\Delta&=b^2-4ac=${result.discriminant.toLatex()}\\\\x&=\\frac{-b\\pm\\sqrt{\\Delta}}{2a}\\\\x&\\in\\{${roots}\\}\\end{aligned}`,
    })
  }
}
