export class CalculationProcedure {
  constructor({ title, summary, steps = [] }) {
    this.title = title
    this.summary = summary
    this.steps = Object.freeze([...steps])
    Object.freeze(this)
  }
}
