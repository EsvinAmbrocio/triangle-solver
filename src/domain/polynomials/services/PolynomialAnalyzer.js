import { Rational } from '../value-objects/Rational.js'

export class PolynomialAnalyzer {
  constructor(rationalRootTheorem, syntheticDivision, quadraticSolver) {
    this.rationalRootTheorem = rationalRootTheorem
    this.syntheticDivision = syntheticDivision
    this.quadraticSolver = quadraticSolver
  }

  analyze(polynomial) {
    let reducedPolynomial = polynomial
    const attempts = []
    const candidateSets = []
    const events = []
    const rootMap = new Map()

    while (reducedPolynomial.degree > 2) {
      if (reducedPolynomial.constantTerm.isZero) {
        const division = this.syntheticDivision.divide(reducedPolynomial, Rational.zero())
        attempts.push(division)
        events.push(Object.freeze({ type: 'division', division }))
        this.#registerRoot(rootMap, Rational.zero())
        reducedPolynomial = division.quotient
        continue
      }

      const candidates = this.rationalRootTheorem.findCandidates(reducedPolynomial)
      const candidateSet = Object.freeze({ polynomial: reducedPolynomial, candidates: Object.freeze(candidates) })
      candidateSets.push(candidateSet)
      events.push(Object.freeze({ type: 'theorem', candidateSet }))
      let successfulDivision = null

      for (const candidate of candidates) {
        const division = this.syntheticDivision.divide(reducedPolynomial, candidate)
        attempts.push(division)
        events.push(Object.freeze({ type: 'division', division }))
        if (division.isRoot) {
          successfulDivision = division
          break
        }
      }

      if (!successfulDivision) break
      this.#registerRoot(rootMap, successfulDivision.candidate)
      reducedPolynomial = successfulDivision.quotient
    }

    let quadraticResult = null
    let linearRoot = null

    if (reducedPolynomial.degree === 2) {
      quadraticResult = this.quadraticSolver.solve(reducedPolynomial)
    } else if (reducedPolynomial.degree === 1) {
      const [a, b] = reducedPolynomial.coefficients
      linearRoot = b.negate().divide(a)
      this.#registerRoot(rootMap, linearRoot)
      reducedPolynomial = reducedPolynomial.degree === 1
        ? this.syntheticDivision.divide(reducedPolynomial, linearRoot).quotient
        : reducedPolynomial
    }

    return Object.freeze({
      originalPolynomial: polynomial,
      rationalRoots: Object.freeze([...rootMap.values()]),
      attempts: Object.freeze(attempts),
      candidateSets: Object.freeze(candidateSets),
      events: Object.freeze(events),
      reducedPolynomial,
      quadraticResult,
      linearRoot,
      unresolved: reducedPolynomial.degree > 2,
    })
  }

  #registerRoot(rootMap, root) {
    const key = root.toString()
    const existing = rootMap.get(key)
    rootMap.set(key, Object.freeze({
      value: root,
      multiplicity: (existing?.multiplicity ?? 0) + 1,
    }))
  }
}
