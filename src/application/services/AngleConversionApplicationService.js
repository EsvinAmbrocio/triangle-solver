import { AngleSource } from '../../domain/angle-conversion/AngleSource.js'
import { InvalidAngleConversionError } from '../../domain/errors/InvalidAngleConversionError.js'
import { CalculationProcedure } from '../../domain/procedures/CalculationProcedure.js'
import { CalculationStep } from '../../domain/procedures/CalculationStep.js'

export class AngleConversionApplicationService {
  constructor(converter) {
    this.converter = converter
  }

  convert(source, input) {
    let result
    if (source === AngleSource.DECIMAL_DEGREES) result = this.converter.fromDecimalDegrees(input.decimalDegrees)
    else if (source === AngleSource.RADIANS) result = this.converter.fromRadians(input.radians)
    else throw new InvalidAngleConversionError('La representación seleccionada no es válida.')

    return Object.freeze({ ...result, source, procedure: this.#procedure(source, input, result) })
  }

  #procedure(source, input, result) {
    const steps = []
    if (source === AngleSource.RADIANS) {
      steps.push(new CalculationStep({
        title: 'Convertir radianes a grados',
        description: 'Se multiplica por 180 y se divide entre π.',
        formula: `\\theta_{deg}=${Number(input.radians)}\\left(\\frac{180}{\\pi}\\right)=${result.decimalDegrees.toFixed(8)}^\\circ`,
      }))
    }

    if (source !== AngleSource.RADIANS) {
      steps.push(new CalculationStep({
        title: 'Convertir grados a radianes',
        description: 'Se multiplica por π/180.',
        formula: `\\theta_{rad}=${result.decimalDegrees.toFixed(8)}\\left(\\frac{\\pi}{180}\\right)=${result.radians.toFixed(10)}\\,rad`,
      }))
    }

    return new CalculationProcedure({
      title: 'Procedimiento de conversión angular',
      summary: 'Conversión entre grados decimales y radianes.',
      steps,
    })
  }
}
