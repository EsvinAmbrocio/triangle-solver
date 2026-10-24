import { describe, expect, it } from 'vitest'
import { AngleConverter } from '../../src/domain/angle-conversion/AngleConverter.js'
import { InvalidAngleConversionError } from '../../src/domain/errors/InvalidAngleConversionError.js'

describe('AngleConverter', () => {
  const converter = new AngleConverter()

  it('converts decimal degrees to radians', () => {
    const result = converter.fromDecimalDegrees(45.5)
    expect(result.radians).toBeCloseTo(45.5 * Math.PI / 180)
  })

  it('converts radians to decimal degrees', () => {
    expect(converter.fromRadians(Math.PI / 2).decimalDegrees).toBeCloseTo(90)
  })

  it('accepts general angles beyond one revolution', () => {
    expect(converter.fromDecimalDegrees(720).radians).toBeCloseTo(4 * Math.PI)
    expect(converter.fromDecimalDegrees(-450).radians).toBeCloseTo(-2.5 * Math.PI)
  })

  it('rejects non-finite values', () => {
    expect(() => converter.fromRadians(Number.POSITIVE_INFINITY)).toThrow(InvalidAngleConversionError)
  })
})
