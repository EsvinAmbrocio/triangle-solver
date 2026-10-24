export class TriangleStrategy {
  constructor(name) {
    if (new.target === TriangleStrategy) {
      throw new TypeError('TriangleStrategy is an abstract class.')
    }

    this.name = name
  }

  supports() {
    throw new Error('supports() must be implemented.')
  }

  solve() {
    throw new Error('solve() must be implemented.')
  }
}
