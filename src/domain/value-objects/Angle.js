import { InvalidAngleError } from '../errors/InvalidAngleError.js'
import { AngleUnit } from './AngleUnit.js'
import { Measurement } from './Measurement.js'

export class Angle extends Measurement {
  constructor(value, unit = AngleUnit.RADIANS, field = null) {
    const numericValue = Number(value)
    const radians = unit === AngleUnit.DEGREES
      ? numericValue * Math.PI / 180
      : numericValue

    if (!Object.values(AngleUnit).includes(unit)) {
      throw new InvalidAngleError('La unidad del ángulo no es válida.', field)
    }

    if (!Number.isFinite(radians) || radians <= 0 || radians >= Math.PI) {
      throw new InvalidAngleError('El ángulo debe estar entre 0° y 180°.', field)
    }

    super(radians)
    Object.freeze(this)
  }

  static fromDegrees(value, field = null) {
    return new Angle(value, AngleUnit.DEGREES, field)
  }

  static fromRadians(value, field = null) {
    return new Angle(value, AngleUnit.RADIANS, field)
  }

  get radians() {
    return this.value
  }

  get degrees() {
    return this.value * 180 / Math.PI
  }
}
