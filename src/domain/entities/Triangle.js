import { InvalidTriangleError } from '../errors/InvalidTriangleError.js'
import { Angle } from '../value-objects/Angle.js'
import { Side } from '../value-objects/Side.js'

export class Triangle {
  #a
  #b
  #c
  #A
  #B
  #C

  constructor({ a = null, b = null, c = null, A = null, B = null, C = null } = {}) {
    this.#assertType(a, Side, 'a')
    this.#assertType(b, Side, 'b')
    this.#assertType(c, Side, 'c')
    this.#assertType(A, Angle, 'A')
    this.#assertType(B, Angle, 'B')
    this.#assertType(C, Angle, 'C')

    this.#a = a
    this.#b = b
    this.#c = c
    this.#A = A
    this.#B = B
    this.#C = C
    Object.freeze(this)
  }

  #assertType(value, ExpectedType, field) {
    if (value !== null && !(value instanceof ExpectedType)) {
      throw new InvalidTriangleError(`El valor de ${field} no es válido.`, field)
    }
  }

  get a() { return this.#a }
  get b() { return this.#b }
  get c() { return this.#c }
  get A() { return this.#A }
  get B() { return this.#B }
  get C() { return this.#C }

  get isComplete() {
    return Object.values(this.toObject()).every(Boolean)
  }

  toObject() {
    return {
      a: this.#a,
      b: this.#b,
      c: this.#c,
      A: this.#A,
      B: this.#B,
      C: this.#C,
    }
  }
}
