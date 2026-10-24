export class CalculationStep {
  constructor({ title, description, formula }) {
    this.title = title
    this.description = description
    this.formula = formula
    Object.freeze(this)
  }
}
