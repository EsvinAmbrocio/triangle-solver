import { describe, expect, it } from 'vitest'
import { TriangleInputBuilder } from '../../src/domain/builders/TriangleInputBuilder.js'
import { ASAAStrategy } from '../../src/domain/strategies/ASAAStrategy.js'
import { SASStrategy } from '../../src/domain/strategies/SASStrategy.js'
import { SSAStrategy } from '../../src/domain/strategies/SSAStrategy.js'
import { SSSStrategy } from '../../src/domain/strategies/SSSStrategy.js'

describe('Triangle strategies', () => {
  it('solves an SSS triangle', () => {
    const input = new TriangleInputBuilder()
      .withSideA(3).withSideB(4).withSideC(5)
      .build()
    const result = new SSSStrategy().solve(input)
    const triangle = result.solutions[0].triangle

    expect(triangle.C.degrees).toBeCloseTo(90)
    expect(result.solutions[0].procedure.steps.length).toBeGreaterThanOrEqual(5)
  })

  it('solves a SAS triangle', () => {
    const input = new TriangleInputBuilder()
      .withSideB(3).withSideC(4).withAngleA(90)
      .build()
    const result = new SASStrategy().solve(input)

    expect(result.solutions[0].triangle.a.value).toBeCloseTo(5)
  })

  it('solves an ASA/AAS triangle', () => {
    const input = new TriangleInputBuilder()
      .withAngleA(50).withAngleB(60).withSideA(7)
      .build()
    const result = new ASAAStrategy().solve(input)

    expect(result.solutions[0].triangle.C.degrees).toBeCloseTo(70)
    expect(result.solutions[0].triangle.b.value).toBeCloseTo(7.9132, 3)
  })

  it('returns two solutions for an ambiguous SSA case', () => {
    const input = new TriangleInputBuilder()
      .withAngleA(30).withSideA(10).withSideB(12)
      .build()

    expect(new SSAStrategy().solve(input).solutions).toHaveLength(2)
  })

  it('returns one solution for the SSA right-angle boundary', () => {
    const input = new TriangleInputBuilder()
      .withAngleA(30).withSideA(5).withSideB(10)
      .build()

    expect(new SSAStrategy().solve(input).solutions).toHaveLength(1)
  })

  it('returns no solutions when the SSA sine ratio is greater than one', () => {
    const input = new TriangleInputBuilder()
      .withAngleA(30).withSideA(2).withSideB(5)
      .build()
    const result = new SSAStrategy().solve(input)

    expect(result.solutions).toHaveLength(0)
    expect(result.emptyProcedure.steps.length).toBeGreaterThanOrEqual(2)
  })
})
