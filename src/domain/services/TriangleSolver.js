import { InsufficientDataError } from '../errors/InsufficientDataError.js'
import { InvalidTriangleError } from '../errors/InvalidTriangleError.js'

export class TriangleSolver {
  constructor(strategies, validator) {
    this.strategies = [...strategies]
    this.validator = validator
  }

  solve(input) {
    this.validator.validateKnownRelations(input)

    const strategy = this.strategies.find((candidate) => candidate.supports(input))
    if (!strategy) {
      throw new InsufficientDataError(
        'Datos insuficientes. Ingresa una combinación SSS, SAS, ASA/AAS o SSA.',
      )
    }

    const result = strategy.solve(input)
    const consistentSolutions = result.solutions.filter(({ triangle }) => {
      this.validator.validateComplete(triangle)
      return this.validator.matchesInput(triangle, input)
    })

    if (result.solutions.length > 0 && consistentSolutions.length === 0) {
      throw new InvalidTriangleError('Los datos adicionales contradicen la solución del triángulo.')
    }

    return { ...result, solutions: consistentSolutions }
  }
}
