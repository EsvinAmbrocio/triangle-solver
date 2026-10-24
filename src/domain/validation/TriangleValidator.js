import { InvalidTriangleError } from '../errors/InvalidTriangleError.js'

const SIDE_KEYS = ['a', 'b', 'c']
const ANGLE_KEYS = ['A', 'B', 'C']

export class TriangleValidator {
  constructor(tolerance = 1e-7) {
    this.tolerance = tolerance
  }

  validateKnownRelations(triangle) {
    const sides = SIDE_KEYS.map((key) => triangle[key]).filter(Boolean)
    const angles = ANGLE_KEYS.map((key) => triangle[key]).filter(Boolean)

    if (sides.length === 3) {
      this.#validateTriangleInequality(sides.map((side) => side.value))
    }

    if (angles.length >= 2) {
      const angleSum = angles.reduce((sum, angle) => sum + angle.radians, 0)
      const isCompleteAngleSet = angles.length === 3
      const invalidSum = isCompleteAngleSet
        ? !this.#close(angleSum, Math.PI)
        : angleSum >= Math.PI - this.tolerance

      if (invalidSum) {
        throw new InvalidTriangleError('Los ángulos proporcionados no forman un triángulo.')
      }
    }
  }

  validateComplete(triangle) {
    if (!triangle.isComplete) {
      throw new InvalidTriangleError('El triángulo resuelto está incompleto.')
    }

    this.#validateTriangleInequality([triangle.a.value, triangle.b.value, triangle.c.value])

    const angleSum = triangle.A.radians + triangle.B.radians + triangle.C.radians
    if (!this.#close(angleSum, Math.PI)) {
      throw new InvalidTriangleError('La suma de los ángulos debe ser 180°.')
    }
  }

  matchesInput(solution, input) {
    return [...SIDE_KEYS, ...ANGLE_KEYS].every((key) => {
      if (!input[key]) return true

      const expected = input[key].value
      const actual = solution[key].value
      const scale = Math.max(1, Math.abs(expected), Math.abs(actual))
      return Math.abs(expected - actual) <= this.tolerance * scale
    })
  }

  #validateTriangleInequality([a, b, c]) {
    if (a + b <= c || a + c <= b || b + c <= a) {
      throw new InvalidTriangleError('Los lados proporcionados no cumplen la desigualdad triangular.')
    }
  }

  #close(first, second) {
    return Math.abs(first - second) <= this.tolerance
  }
}
