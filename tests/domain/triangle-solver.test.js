import { describe, expect, it } from 'vitest'
import { TriangleInputBuilder } from '../../src/domain/builders/TriangleInputBuilder.js'
import { InsufficientDataError } from '../../src/domain/errors/InsufficientDataError.js'
import { InvalidTriangleError } from '../../src/domain/errors/InvalidTriangleError.js'
import { createSolver } from '../helpers/createSolver.js'

describe('TriangleSolver', () => {
  it('rejects insufficient data', () => {
    const input = new TriangleInputBuilder().withSideA(3).withSideB(4).build()
    expect(() => createSolver().solve(input)).toThrow(InsufficientDataError)
  })

  it('uses SSS priority and validates an additional angle', () => {
    const input = new TriangleInputBuilder()
      .withSideA(3).withSideB(4).withSideC(5).withAngleC(90)
      .build()
    const result = createSolver().solve(input)

    expect(result.strategy).toBe('SSS')
  })

  it('rejects contradictory additional data', () => {
    const input = new TriangleInputBuilder()
      .withSideA(3).withSideB(4).withSideC(5).withAngleA(60)
      .build()

    expect(() => createSolver().solve(input)).toThrow(InvalidTriangleError)
  })
})
