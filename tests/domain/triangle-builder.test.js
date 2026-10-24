import { describe, expect, it } from 'vitest'
import { TriangleInputBuilder } from '../../src/domain/builders/TriangleInputBuilder.js'
import { Angle } from '../../src/domain/value-objects/Angle.js'
import { Side } from '../../src/domain/value-objects/Side.js'

describe('TriangleInputBuilder', () => {
  it('builds an immutable triangle with the supplied measurements', () => {
    const triangle = new TriangleInputBuilder()
      .withSideA(3)
      .withSideB(4)
      .withAngleC(90)
      .build()

    expect(triangle.a).toBeInstanceOf(Side)
    expect(triangle.b.value).toBe(4)
    expect(triangle.C).toBeInstanceOf(Angle)
    expect(triangle.C.degrees).toBeCloseTo(90)
    expect(Object.isFrozen(triangle)).toBe(true)
  })

  it('accepts radians explicitly', () => {
    const triangle = new TriangleInputBuilder()
      .withAngleA(Math.PI / 4, 'radians')
      .build()

    expect(triangle.A.degrees).toBeCloseTo(45)
  })
})
