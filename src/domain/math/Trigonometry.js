export class Trigonometry {
  static toDegrees(radians) {
    return radians * 180 / Math.PI
  }

  static toRadians(degrees) {
    return degrees * Math.PI / 180
  }

  static clamp(value, minimum = -1, maximum = 1) {
    return Math.min(maximum, Math.max(minimum, value))
  }

  static sideByCosineLaw(adjacentSide1, adjacentSide2, includedAngle) {
    return Math.sqrt(
      adjacentSide1 ** 2
      + adjacentSide2 ** 2
      - 2 * adjacentSide1 * adjacentSide2 * Math.cos(includedAngle),
    )
  }

  static angleByCosineLaw(oppositeSide, adjacentSide1, adjacentSide2) {
    const cosine = (
      adjacentSide1 ** 2
      + adjacentSide2 ** 2
      - oppositeSide ** 2
    ) / (2 * adjacentSide1 * adjacentSide2)

    return Math.acos(this.clamp(cosine))
  }

  static sideBySineLaw(knownSide, targetAngle, knownAngle) {
    return knownSide * Math.sin(targetAngle) / Math.sin(knownAngle)
  }
}
