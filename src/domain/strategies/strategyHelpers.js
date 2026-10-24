import { Triangle } from '../entities/Triangle.js'
import { Trigonometry } from '../math/Trigonometry.js'
import { Angle } from '../value-objects/Angle.js'
import { Side } from '../value-objects/Side.js'

export const sideKeys = ['a', 'b', 'c']
export const angleKeys = ['A', 'B', 'C']

export function createCompleteTriangle(values) {
  return new Triangle({
    a: new Side(values.a),
    b: new Side(values.b),
    c: new Side(values.c),
    A: Angle.fromRadians(values.A),
    B: Angle.fromRadians(values.B),
    C: Angle.fromRadians(values.C),
  })
}

export function solveFromSides({ a, b, c }) {
  const A = Trigonometry.angleByCosineLaw(a, b, c)
  const B = Trigonometry.angleByCosineLaw(b, a, c)
  const C = Math.PI - A - B
  return { a, b, c, A, B, C }
}

export function number(value) {
  return Number(value).toFixed(6)
}
