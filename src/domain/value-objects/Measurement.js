export class Measurement {
  #value

  constructor(value) {
    if (new.target === Measurement) {
      throw new TypeError('Measurement is an abstract class.')
    }

    this.#value = value
  }

  get value() {
    return this.#value
  }

  equals(other, tolerance = 1e-10) {
    return other?.constructor === this.constructor
      && Math.abs(other.value - this.value) <= tolerance
  }
}
