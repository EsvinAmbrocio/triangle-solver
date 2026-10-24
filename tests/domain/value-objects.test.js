import { describe, expect, it } from 'vitest'
import { InvalidAngleError } from '../../src/domain/errors/InvalidAngleError.js'
import { InvalidSideError } from '../../src/domain/errors/InvalidSideError.js'
import { Angle } from '../../src/domain/value-objects/Angle.js'
import { Measurement } from '../../src/domain/value-objects/Measurement.js'
import { Side } from '../../src/domain/value-objects/Side.js'

describe('Measurement value objects', () => {
  it('does not allow direct Measurement instances', () => {
    expect(() => new Measurement(1)).toThrow(TypeError)
  })

  it('creates an immutable positive side', () => {
    const side = new Side(4.5)
    expect(side.value).toBe(4.5)
    expect(Object.isFrozen(side)).toBe(true)
  })

  it.each([0, -2, Number.NaN, 'invalid'])('rejects invalid sides', (value) => {
    expect(() => new Side(value)).toThrow(InvalidSideError)
  })

  it('stores angles internally in radians', () => {
    const angle = Angle.fromDegrees(60)
    expect(angle.radians).toBeCloseTo(Math.PI / 3)
    expect(angle.degrees).toBeCloseTo(60)
  })

  it.each([0, 180, -1, Number.NaN])('rejects invalid angles', (value) => {
    expect(() => Angle.fromDegrees(value)).toThrow(InvalidAngleError)
  })
})
