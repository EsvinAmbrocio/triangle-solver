import { TriangleInputBuilder } from '../../domain/builders/TriangleInputBuilder.js'
import { AngleUnit } from '../../domain/value-objects/AngleUnit.js'

const FIELD_METHODS = {
  a: 'withSideA',
  b: 'withSideB',
  c: 'withSideC',
  A: 'withAngleA',
  B: 'withAngleB',
  C: 'withAngleC',
}

export class TriangleApplicationService {
  constructor(solver, builderFactory = () => new TriangleInputBuilder()) {
    this.solver = solver
    this.builderFactory = builderFactory
  }

  solve(input) {
    const builder = this.builderFactory()
    const angleUnit = input.angleUnit ?? AngleUnit.DEGREES

    for (const [field, method] of Object.entries(FIELD_METHODS)) {
      if (!this.#hasValue(input[field])) continue

      if (field === field.toUpperCase()) {
        builder[method](input[field], angleUnit)
      } else {
        builder[method](input[field])
      }
    }

    return this.solver.solve(builder.build())
  }

  #hasValue(value) {
    return value !== null && value !== undefined && String(value).trim() !== ''
  }
}
