import { TriangleSolver } from '../../src/domain/services/TriangleSolver.js'
import { ASAAStrategy } from '../../src/domain/strategies/ASAAStrategy.js'
import { SASStrategy } from '../../src/domain/strategies/SASStrategy.js'
import { SSAStrategy } from '../../src/domain/strategies/SSAStrategy.js'
import { SSSStrategy } from '../../src/domain/strategies/SSSStrategy.js'
import { TriangleValidator } from '../../src/domain/validation/TriangleValidator.js'

export function createSolver() {
  return new TriangleSolver([
    new SSSStrategy(),
    new SASStrategy(),
    new ASAAStrategy(),
    new SSAStrategy(),
  ], new TriangleValidator())
}
