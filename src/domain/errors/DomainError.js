export class DomainError extends Error {
  constructor(message, field = null) {
    super(message)
    this.name = new.target.name
    this.field = field
  }
}
