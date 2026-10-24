import { describe, expect, it } from 'vitest'
import { TriangleInputBuilder } from '../../src/domain/builders/TriangleInputBuilder.js'
import { InvalidTriangleError } from '../../src/domain/errors/InvalidTriangleError.js'
import { TriangleValidator } from '../../src/domain/validation/TriangleValidator.js'

describe('TriangleValidator', () => {
  const validator = new TriangleValidator()

  it('accepts valid known relations', () => {
    const triangle = new TriangleInputBuilder()
      .withSideA(3).withSideB(4).withSideC(5)
      .build()

    expect(() => validator.validateKnownRelations(triangle)).not.toThrow()
  })

  it('rejects sides that violate the triangle inequality', () => {
    const triangle = new TriangleInputBuilder()
      .withSideA(1).withSideB(2).withSideC(3)
      .build()

    expect(() => validator.validateKnownRelations(triangle)).toThrow(InvalidTriangleError)
  })

  it('rejects two angles whose sum reaches 180 degrees', () => {
    const triangle = new TriangleInputBuilder()
      .withAngleA(100).withAngleB(80)
      .build()

    expect(() => validator.validateKnownRelations(triangle)).toThrow(InvalidTriangleError)
  })
})
