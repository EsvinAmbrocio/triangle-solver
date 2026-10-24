import { describe, expect, it } from 'vitest'
import { Polynomial } from '../../../src/domain/polynomials/entities/Polynomial.js'
import { PolynomialAnalyzer } from '../../../src/domain/polynomials/services/PolynomialAnalyzer.js'
import { QuadraticSolver } from '../../../src/domain/polynomials/services/QuadraticSolver.js'
import { RationalRootTheorem } from '../../../src/domain/polynomials/services/RationalRootTheorem.js'
import { SyntheticDivision } from '../../../src/domain/polynomials/services/SyntheticDivision.js'
import { Rational } from '../../../src/domain/polynomials/value-objects/Rational.js'

describe('Polynomial analysis services', () => {
  const theorem = new RationalRootTheorem()
  const division = new SyntheticDivision()
  const quadraticSolver = new QuadraticSolver()
  const analyzer = new PolynomialAnalyzer(theorem, division, quadraticSolver)

  it('generates unique simplified rational-root candidates', () => {
    const candidates = theorem.findCandidates(Polynomial.fromInput([2, -3, 1]))
    expect(candidates.map((candidate) => candidate.toString())).toEqual(['-1', '-1/2', '1/2', '1'])
  })

  it('performs synthetic division exactly with a rational root', () => {
    const result = division.divide(Polynomial.fromInput([2, -3, 1]), new Rational(1, 2))
    expect(result.isRoot).toBe(true)
    expect(result.remainder.isZero).toBe(true)
    expect(result.quotient.coefficients.map(String)).toEqual(['2', '-2'])
  })

  it('detects repeated roots and resolves a complex quadratic remainder', () => {
    const result = analyzer.analyze(Polynomial.fromInput([1, 0, -2, 2, -3, 2]))
    const roots = Object.fromEntries(result.rationalRoots.map((root) => [root.value.toString(), root.multiplicity]))

    expect(roots).toEqual({ '1': 2, '-2': 1 })
    expect(result.reducedPolynomial.degree).toBe(2)
    expect(result.quadraticResult.nature).toBe('two-complex')
  })

  it('extracts repeated zero roots before applying the theorem', () => {
    const result = analyzer.analyze(Polynomial.fromInput([1, 0, -1, 0, 0, 0]))
    const zeroRoot = result.rationalRoots.find((root) => root.value.isZero)
    expect(zeroRoot.multiplicity).toBe(3)
    expect(result.quadraticResult.nature).toBe('two-real')
  })

  it('handles positive, zero and negative quadratic discriminants', () => {
    expect(quadraticSolver.solve(Polynomial.fromInput([1, -3, 2])).nature).toBe('two-real')
    expect(quadraticSolver.solve(Polynomial.fromInput([1, -2, 1])).nature).toBe('double-real')
    expect(quadraticSolver.solve(Polynomial.fromInput([1, 0, 1])).nature).toBe('two-complex')
  })
})
