import { Trigonometry } from '../math/Trigonometry.js'
import { CalculationProcedure } from '../procedures/CalculationProcedure.js'
import { CalculationStep } from '../procedures/CalculationStep.js'
import { TriangleStrategy } from './TriangleStrategy.js'
import { createCompleteTriangle, number, sideKeys, solveFromSides } from './strategyHelpers.js'

const SAS_CASES = [
  { angle: 'A', adjacent: ['b', 'c'], opposite: 'a' },
  { angle: 'B', adjacent: ['a', 'c'], opposite: 'b' },
  { angle: 'C', adjacent: ['a', 'b'], opposite: 'c' },
]

export class SASStrategy extends TriangleStrategy {
  constructor() {
    super('SAS')
  }

  findCase(triangle) {
    return SAS_CASES.find(({ angle, adjacent }) => (
      triangle[angle] && triangle[adjacent[0]] && triangle[adjacent[1]]
    ))
  }

  supports(triangle) {
    return Boolean(this.findCase(triangle))
  }

  solve(triangle) {
    const selectedCase = this.findCase(triangle)
    const { angle, adjacent, opposite } = selectedCase
    const firstSide = triangle[adjacent[0]].value
    const secondSide = triangle[adjacent[1]].value
    const includedAngle = triangle[angle].radians
    const missingSide = Trigonometry.sideByCosineLaw(firstSide, secondSide, includedAngle)
    const sides = {
      a: triangle.a?.value,
      b: triangle.b?.value,
      c: triangle.c?.value,
      [opposite]: missingSide,
    }
    const solution = createCompleteTriangle(solveFromSides(sides))
    const remainingAngles = ['A', 'B', 'C'].filter((key) => key !== angle)
    const firstAngle = remainingAngles[0]
    const secondAngle = remainingAngles[1]
    const firstOppositeSide = firstAngle.toLowerCase()
    const firstAdjacentSides = sideKeys.filter((key) => key !== firstOppositeSide)

    const procedure = new CalculationProcedure({
      title: 'Solución SAS — Lado, Ángulo, Lado',
      summary: `SAS indica que ${angle} es el ángulo comprendido entre los lados ${adjacent[0]} y ${adjacent[1]}.`,
      steps: [
        new CalculationStep({
          title: 'Interpretar el caso SAS',
          description: 'S significa lado y A significa ángulo. El ángulo conocido se encuentra entre los dos lados conocidos.',
          formula: `\\begin{aligned}\\text{SAS}&=\\text{Side-Angle-Side}\\\\&=\\text{Lado-Ángulo-Lado}\\\\(${adjacent[0]},${angle},${adjacent[1]})&=(${number(firstSide)},${number(triangle[angle].degrees)}^\\circ,${number(secondSide)})\\end{aligned}`,
        }),
        new CalculationStep({
          title: `Calcular el lado ${opposite}`,
          description: `El ángulo ${angle} está comprendido entre los lados ${adjacent[0]} y ${adjacent[1]}; por eso se aplica la ley de cosenos.`,
          formula: `\\begin{aligned}${opposite}^2&=${adjacent[0]}^2+${adjacent[1]}^2-2(${adjacent[0]})(${adjacent[1]})\\cos(${angle})\\\\${opposite}&=\\sqrt{${number(firstSide)}^2+${number(secondSide)}^2-2(${number(firstSide)})(${number(secondSide)})\\cos(${number(triangle[angle].degrees)}^\\circ)}\\\\&=${number(missingSide)}\\end{aligned}`,
        }),
        new CalculationStep({
          title: `Calcular el ángulo ${firstAngle}`,
          description: 'Con los tres lados conocidos se vuelve a aplicar la ley de cosenos.',
          formula: `\\begin{aligned}${firstAngle}&=\\cos^{-1}\\left(\\frac{${firstAdjacentSides[0]}^2+${firstAdjacentSides[1]}^2-${firstOppositeSide}^2}{2(${firstAdjacentSides[0]})(${firstAdjacentSides[1]})}\\right)\\\\&=\\cos^{-1}\\left(\\frac{${number(solution[firstAdjacentSides[0]].value)}^2+${number(solution[firstAdjacentSides[1]].value)}^2-${number(solution[firstOppositeSide].value)}^2}{2(${number(solution[firstAdjacentSides[0]].value)})(${number(solution[firstAdjacentSides[1]].value)})}\\right)\\\\&=${number(solution[firstAngle].degrees)}^\\circ\\end{aligned}`,
        }),
        new CalculationStep({
          title: `Calcular el ángulo ${secondAngle}`,
          description: 'El ángulo restante se obtiene completando la suma interior.',
          formula: `\\begin{aligned}${secondAngle}&=180^\\circ-${angle}-${firstAngle}\\\\&=180^\\circ-${number(solution[angle].degrees)}^\\circ-${number(solution[firstAngle].degrees)}^\\circ\\\\&=${number(solution[secondAngle].degrees)}^\\circ\\end{aligned}`,
        }),
        new CalculationStep({
          title: 'Convertir los ángulos a radianes',
          description: 'Se utiliza θ(rad) = θ(°) · π/180 para convertir cada resultado.',
          formula: `\\begin{aligned}A_{rad}&=${number(solution.A.degrees)}\\left(\\frac{\\pi}{180}\\right)=${number(solution.A.radians)}\\,rad\\\\B_{rad}&=${number(solution.B.degrees)}\\left(\\frac{\\pi}{180}\\right)=${number(solution.B.radians)}\\,rad\\\\C_{rad}&=${number(solution.C.degrees)}\\left(\\frac{\\pi}{180}\\right)=${number(solution.C.radians)}\\,rad\\end{aligned}`,
        }),
        new CalculationStep({
          title: 'Comprobar la solución',
          description: 'Se verifica que los tres ángulos sumen 180°.',
          formula: `${number(solution.A.degrees)}^\\circ+${number(solution.B.degrees)}^\\circ+${number(solution.C.degrees)}^\\circ=180.000000^\\circ`,
        }),
      ],
    })

    return { strategy: this.name, solutions: [{ triangle: solution, procedure }] }
  }
}
