import { CalculationProcedure } from '../procedures/CalculationProcedure.js'
import { CalculationStep } from '../procedures/CalculationStep.js'
import { TriangleStrategy } from './TriangleStrategy.js'
import { createCompleteTriangle, number, solveFromSides } from './strategyHelpers.js'

export class SSSStrategy extends TriangleStrategy {
  constructor() {
    super('SSS')
  }

  supports(triangle) {
    return Boolean(triangle.a && triangle.b && triangle.c)
  }

  solve(triangle) {
    const a = triangle.a.value
    const b = triangle.b.value
    const c = triangle.c.value
    const values = solveFromSides({ a, b, c })
    const solution = createCompleteTriangle(values)

    const procedure = new CalculationProcedure({
      title: 'Solución SSS — Lado, Lado, Lado',
      summary: 'SSS indica que los tres lados son conocidos; por eso se aplica la ley de cosenos.',
      steps: [
        new CalculationStep({
          title: 'Interpretar el caso SSS',
          description: 'S viene de Side, que significa lado. Las tres letras indican que conocemos a, b y c.',
          formula: `\\begin{aligned}\\text{SSS}&=\\text{Side-Side-Side}\\\\&=\\text{Lado-Lado-Lado}\\\\(a,b,c)&=(${number(a)},${number(b)},${number(c)})\\end{aligned}`,
        }),
        new CalculationStep({
          title: 'Comprobar la desigualdad triangular',
          description: 'La suma de cada par de lados debe ser mayor que el lado restante.',
          formula: `\\begin{aligned}${number(a)}+${number(b)}&>${number(c)}\\\\${number(a)}+${number(c)}&>${number(b)}\\\\${number(b)}+${number(c)}&>${number(a)}\\end{aligned}`,
        }),
        new CalculationStep({
          title: 'Calcular el ángulo A',
          description: 'Se parte de a² = b² + c² − 2bc cos(A) y se despeja A.',
          formula: `\\begin{aligned}A&=\\cos^{-1}\\left(\\frac{b^2+c^2-a^2}{2bc}\\right)\\\\&=\\cos^{-1}\\left(\\frac{${number(b)}^2+${number(c)}^2-${number(a)}^2}{2(${number(b)})(${number(c)})}\\right)\\\\&=${number(solution.A.degrees)}^\\circ\\end{aligned}`,
        }),
        new CalculationStep({
          title: 'Calcular el ángulo B',
          description: 'Se repite la ley de cosenos para B.',
          formula: `\\begin{aligned}B&=\\cos^{-1}\\left(\\frac{a^2+c^2-b^2}{2ac}\\right)\\\\&=\\cos^{-1}\\left(\\frac{${number(a)}^2+${number(c)}^2-${number(b)}^2}{2(${number(a)})(${number(c)})}\\right)\\\\&=${number(solution.B.degrees)}^\\circ\\end{aligned}`,
        }),
        new CalculationStep({
          title: 'Calcular el ángulo C',
          description: 'El último ángulo completa la suma interior.',
          formula: `\\begin{aligned}C&=180^\\circ-A-B\\\\&=180^\\circ-${number(solution.A.degrees)}^\\circ-${number(solution.B.degrees)}^\\circ\\\\&=${number(solution.C.degrees)}^\\circ\\end{aligned}`,
        }),
        new CalculationStep({
          title: 'Convertir los ángulos a radianes',
          description: 'Cada medida en grados se multiplica por π/180 para obtener su equivalente en radianes.',
          formula: `\\begin{aligned}A_{rad}&=${number(solution.A.degrees)}\\left(\\frac{\\pi}{180}\\right)=${number(solution.A.radians)}\\,rad\\\\B_{rad}&=${number(solution.B.degrees)}\\left(\\frac{\\pi}{180}\\right)=${number(solution.B.radians)}\\,rad\\\\C_{rad}&=${number(solution.C.degrees)}\\left(\\frac{\\pi}{180}\\right)=${number(solution.C.radians)}\\,rad\\end{aligned}`,
        }),
        new CalculationStep({
          title: 'Comprobar la suma angular',
          description: 'Los resultados deben sumar exactamente 180° antes del redondeo.',
          formula: `${number(solution.A.degrees)}^\\circ+${number(solution.B.degrees)}^\\circ+${number(solution.C.degrees)}^\\circ=180.000000^\\circ`,
        }),
      ],
    })

    return { strategy: this.name, solutions: [{ triangle: solution, procedure }] }
  }
}
