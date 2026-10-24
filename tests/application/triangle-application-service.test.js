import { describe, expect, it } from 'vitest'
import { TriangleApplicationService } from '../../src/application/services/TriangleApplicationService.js'
import { createSolver } from '../helpers/createSolver.js'

describe('TriangleApplicationService', () => {
  it('ignores empty fields and solves plain form values', () => {
    const service = new TriangleApplicationService(createSolver())
    const result = service.solve({
      a: '3', b: '4', c: '5', A: '', B: '', C: '', angleUnit: 'degrees',
    })

    expect(result.strategy).toBe('SSS')
    expect(result.solutions[0].triangle.c.value).toBe(5)
  })

  it('accepts angle input in radians', () => {
    const service = new TriangleApplicationService(createSolver())
    const result = service.solve({
      a: '3', b: '4', C: String(Math.PI / 2), angleUnit: 'radians',
    })

    expect(result.strategy).toBe('SAS')
    expect(result.solutions[0].triangle.c.value).toBeCloseTo(5)
  })
})
