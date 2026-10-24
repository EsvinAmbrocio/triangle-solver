import { InvalidSideError } from '../errors/InvalidSideError.js'
import { Measurement } from './Measurement.js'

export class Side extends Measurement {
  constructor(value, field = null) {
    const numericValue = Number(value)

    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      throw new InvalidSideError('El lado debe ser un número positivo.', field)
    }

    super(numericValue)
    Object.freeze(this)
  }
}
