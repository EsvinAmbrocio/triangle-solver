import { InvalidAngleConversionError } from '../errors/InvalidAngleConversionError.js'

export class AngleConverter {
  fromDecimalDegrees(value) {
    const degrees = this.#finiteNumber(value, 'decimalDegrees')
    return this.#result(degrees)
  }

  fromRadians(value) {
    const radians = this.#finiteNumber(value, 'radians')
    return this.#result(radians * 180 / Math.PI)
  }

  #result(decimalDegrees) {
    return Object.freeze({
      decimalDegrees,
      radians: decimalDegrees * Math.PI / 180,
    })
  }

  #finiteNumber(value, field) {
    if (value === '' || value === null || value === undefined) {
      throw new InvalidAngleConversionError('Ingresa un valor numérico.', field)
    }
    const number = Number(value)
    if (!Number.isFinite(number)) {
      throw new InvalidAngleConversionError('El valor debe ser un número finito.', field)
    }
    return number
  }
}
