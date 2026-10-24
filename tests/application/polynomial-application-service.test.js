import { describe, expect, it } from 'vitest'
import { PolynomialApplicationService } from '../../src/application/services/PolynomialApplicationService.js'
import { PolynomialAnalyzer } from '../../src/domain/polynomials/services/PolynomialAnalyzer.js'
import { PolynomialFormatter } from '../../src/domain/polynomials/services/PolynomialFormatter.js'
import { QuadraticSolver } from '../../src/domain/polynomials/services/QuadraticSolver.js'
import { RationalRootTheorem } from '../../src/domain/polynomials/services/RationalRootTheorem.js'
import { SyntheticDivision } from '../../src/domain/polynomials/services/SyntheticDivision.js'

function createService() {
  const theorem = new RationalRootTheorem()
  return new PolynomialApplicationService(
    new PolynomialAnalyzer(theorem, new SyntheticDivision(), new QuadraticSolver()),
    new PolynomialFormatter(),
    theorem,
  )
}

describe('PolynomialApplicationService', () => {
  it('analyzes the assigned degree-five example', () => {
    const result = createService().analyze([2, -5, 5, 15, -47, 30])
    const roots = result.rationalRoots.map((root) => root.value.toString())

    expect(roots).toEqual(['-2', '1', '3/2'])
    expect(result.quadraticResult.nature).toBe('two-complex')
    expect(result.quadraticResult.roots[0]).toMatchObject({ real: 1, imaginary: 2 })
    expect(result.procedure.steps.length).toBeGreaterThan(5)
  })
})
