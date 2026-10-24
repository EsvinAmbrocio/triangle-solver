import { describe, expect, it } from 'vitest'
import { AngleConversionApplicationService } from '../../src/application/services/AngleConversionApplicationService.js'
import { AngleConverter } from '../../src/domain/angle-conversion/AngleConverter.js'
import { AngleSource } from '../../src/domain/angle-conversion/AngleSource.js'

describe('AngleConversionApplicationService', () => {
  it('coordinates a conversion and creates its procedure', () => {
    const service = new AngleConversionApplicationService(new AngleConverter())
    const result = service.convert(AngleSource.DECIMAL_DEGREES, { decimalDegrees: 45.5 })

    expect(result.radians).toBeCloseTo(0.7941248097)
    expect(result.procedure.steps.length).toBeGreaterThanOrEqual(1)
  })
})
