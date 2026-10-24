import { Triangle } from '../entities/Triangle.js'
import { Angle } from '../value-objects/Angle.js'
import { AngleUnit } from '../value-objects/AngleUnit.js'
import { Side } from '../value-objects/Side.js'

export class TriangleInputBuilder {
  #values = {}

  withSideA(value) {
    this.#values.a = value instanceof Side ? value : new Side(value, 'a')
    return this
  }

  withSideB(value) {
    this.#values.b = value instanceof Side ? value : new Side(value, 'b')
    return this
  }

  withSideC(value) {
    this.#values.c = value instanceof Side ? value : new Side(value, 'c')
    return this
  }

  withAngleA(value, unit = AngleUnit.DEGREES) {
    this.#values.A = value instanceof Angle ? value : new Angle(value, unit, 'A')
    return this
  }

  withAngleB(value, unit = AngleUnit.DEGREES) {
    this.#values.B = value instanceof Angle ? value : new Angle(value, unit, 'B')
    return this
  }

  withAngleC(value, unit = AngleUnit.DEGREES) {
    this.#values.C = value instanceof Angle ? value : new Angle(value, unit, 'C')
    return this
  }

  build() {
    return new Triangle(this.#values)
  }
}
