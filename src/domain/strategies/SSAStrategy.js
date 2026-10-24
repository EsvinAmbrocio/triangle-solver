import { Trigonometry } from '../math/Trigonometry.js'
import { CalculationProcedure } from '../procedures/CalculationProcedure.js'
import { CalculationStep } from '../procedures/CalculationStep.js'
import { TriangleStrategy } from './TriangleStrategy.js'
import { angleKeys, createCompleteTriangle, number, sideKeys } from './strategyHelpers.js'

const EPSILON = 1e-10

export class SSAStrategy extends TriangleStrategy {
  constructor() {
    super('SSA')
  }

  findCase(triangle) {
    for (const angleKey of angleKeys) {
      const oppositeSideKey = angleKey.toLowerCase()
      if (!triangle[angleKey] || !triangle[oppositeSideKey]) continue

      const secondSideKey = sideKeys.find((key) => key !== oppositeSideKey && triangle[key])
      if (secondSideKey) {
        return { angleKey, oppositeSideKey, secondSideKey }
      }
    }

    return null
  }

  supports(triangle) {
    return Boolean(this.findCase(triangle))
  }

  solve(triangle) {
    const selectedCase = this.findCase(triangle)
    const { angleKey, oppositeSideKey, secondSideKey } = selectedCase
    const secondAngleKey = secondSideKey.toUpperCase()
    const thirdSideKey = sideKeys.find((key) => ![oppositeSideKey, secondSideKey].includes(key))
    const thirdAngleKey = thirdSideKey.toUpperCase()
    const knownAngle = triangle[angleKey].radians
    const oppositeSide = triangle[oppositeSideKey].value
    const secondSide = triangle[secondSideKey].value
    const sineRatio = secondSide * Math.sin(knownAngle) / oppositeSide

    if (sineRatio > 1 + EPSILON) {
      return {
        strategy: this.name,
        solutions: [],
        emptyProcedure: this.#createEmptyProcedure(selectedCase, sineRatio, knownAngle),
      }
    }

    const primaryAngle = Math.abs(sineRatio - 1) <= EPSILON
      ? Math.PI / 2
      : Math.asin(Trigonometry.clamp(sineRatio))
    const candidateAngles = [primaryAngle]
    const supplementaryAngle = Math.PI - primaryAngle

    if (Math.abs(primaryAngle - supplementaryAngle) > EPSILON) {
      candidateAngles.push(supplementaryAngle)
    }

    const validAngles = candidateAngles.filter((candidate) => (
      knownAngle + candidate < Math.PI - EPSILON
    ))

    const solutions = validAngles.map((secondAngle, index) => {
      const thirdAngle = Math.PI - knownAngle - secondAngle
      const thirdSide = Trigonometry.sideBySineLaw(oppositeSide, thirdAngle, knownAngle)
      const values = {
        [oppositeSideKey]: oppositeSide,
        [secondSideKey]: secondSide,
        [thirdSideKey]: thirdSide,
        [angleKey]: knownAngle,
        [secondAngleKey]: secondAngle,
        [thirdAngleKey]: thirdAngle,
      }
      const solution = createCompleteTriangle(values)

      return {
        triangle: solution,
        procedure: this.#createProcedure({
          solution,
          selectedCase,
          sineRatio,
          index,
        }),
      }
    })

    return { strategy: this.name, solutions }
  }

  #createProcedure({ solution, selectedCase, sineRatio, index }) {
    const { angleKey, oppositeSideKey, secondSideKey } = selectedCase
    const secondAngleKey = secondSideKey.toUpperCase()
    const thirdSideKey = sideKeys.find((key) => ![oppositeSideKey, secondSideKey].includes(key))
    const thirdAngleKey = thirdSideKey.toUpperCase()
    const knownAngle = solution[angleKey].degrees
    const oppositeSide = solution[oppositeSideKey].value
    const secondSide = solution[secondSideKey].value
    const principalAngle = Math.asin(Trigonometry.clamp(sineRatio)) * 180 / Math.PI

    return new CalculationProcedure({
      title: `Solución SSA — Lado, Lado, Ángulo${index > 0 ? ' (alternativa)' : ''}`,
      summary: 'SSA tiene un ángulo no comprendido y puede generar dos triángulos distintos.',
      steps: [
        new CalculationStep({
          title: 'Interpretar el caso SSA y sus pares opuestos',
          description: `SSA significa dos lados y un ángulo no comprendido. El lado ${oppositeSideKey} está frente a ${angleKey}, y ${secondSideKey} está frente a ${secondAngleKey}.`,
          formula: `\\begin{aligned}\\text{SSA}&=\\text{Side-Side-Angle}=\\text{Lado-Lado-Ángulo}\\\\(${oppositeSideKey},${angleKey})&=(${number(oppositeSide)},${number(knownAngle)}^\\circ)\\\\(${secondSideKey},${secondAngleKey})&=(${number(secondSide)},${secondAngleKey})\\end{aligned}`,
        }),
        new CalculationStep({
          title: `Despejar sen(${secondAngleKey})`,
          description: 'Se plantea la ley de senos y se despeja el seno del ángulo desconocido.',
          formula: `\\begin{aligned}\\frac{${oppositeSideKey}}{\\sin(${angleKey})}&=\\frac{${secondSideKey}}{\\sin(${secondAngleKey})}\\\\[4pt]\\sin(${secondAngleKey})&=\\frac{${secondSideKey}\\sin(${angleKey})}{${oppositeSideKey}}\\\\[4pt]&=\\frac{${number(secondSide)}\\sin(${number(knownAngle)}^\\circ)}{${number(oppositeSide)}}=${number(sineRatio)}\\end{aligned}`,
        }),
        new CalculationStep({
          title: `Calcular el ángulo ${secondAngleKey}`,
          description: index > 0
            ? 'En el caso ambiguo se evalúa también el suplemento del ángulo principal.'
            : 'Primero se obtiene la solución principal mediante el arcoseno.',
          formula: index > 0
            ? `\\begin{aligned}${secondAngleKey}_1&=\\sin^{-1}(${number(sineRatio)})=${number(principalAngle)}^\\circ\\\\${secondAngleKey}_2&=180^\\circ-${secondAngleKey}_1=${number(solution[secondAngleKey].degrees)}^\\circ\\end{aligned}`
            : `${secondAngleKey}_1=\\sin^{-1}(${number(sineRatio)})=${number(solution[secondAngleKey].degrees)}^\\circ`,
        }),
        new CalculationStep({
          title: `Calcular el ángulo ${thirdAngleKey}`,
          description: 'La suma de los tres ángulos interiores debe ser 180°.',
          formula: `\\begin{aligned}${thirdAngleKey}&=180^\\circ-${angleKey}-${secondAngleKey}\\\\&=180^\\circ-${number(knownAngle)}^\\circ-${number(solution[secondAngleKey].degrees)}^\\circ\\\\&=${number(solution[thirdAngleKey].degrees)}^\\circ\\end{aligned}`,
        }),
        new CalculationStep({
          title: `Calcular el lado ${thirdSideKey}`,
          description: 'Se vuelve a aplicar la ley de senos usando el par opuesto conocido.',
          formula: `\\begin{aligned}\\frac{${thirdSideKey}}{\\sin(${thirdAngleKey})}&=\\frac{${oppositeSideKey}}{\\sin(${angleKey})}\\\\${thirdSideKey}&=\\frac{${oppositeSideKey}\\sin(${thirdAngleKey})}{\\sin(${angleKey})}\\\\&=\\frac{${number(oppositeSide)}\\sin(${number(solution[thirdAngleKey].degrees)}^\\circ)}{\\sin(${number(knownAngle)}^\\circ)}\\\\&=${number(solution[thirdSideKey].value)}\\end{aligned}`,
        }),
        new CalculationStep({
          title: 'Convertir los ángulos a radianes',
          description: 'Se multiplica cada ángulo expresado en grados por π/180.',
          formula: `\\begin{aligned}A_{rad}&=${number(solution.A.degrees)}\\left(\\frac{\\pi}{180}\\right)=${number(solution.A.radians)}\\,rad\\\\B_{rad}&=${number(solution.B.degrees)}\\left(\\frac{\\pi}{180}\\right)=${number(solution.B.radians)}\\,rad\\\\C_{rad}&=${number(solution.C.degrees)}\\left(\\frac{\\pi}{180}\\right)=${number(solution.C.radians)}\\,rad\\end{aligned}`,
        }),
        new CalculationStep({
          title: 'Comprobar la solución',
          description: 'Se verifica la suma angular y la correspondencia entre lados y ángulos.',
          formula: `${number(solution.A.degrees)}^\\circ+${number(solution.B.degrees)}^\\circ+${number(solution.C.degrees)}^\\circ=180.000000^\\circ`,
        }),
      ],
    })
  }

  #createEmptyProcedure(selectedCase, sineRatio, knownAngle) {
    const secondAngleKey = selectedCase.secondSideKey.toUpperCase()
    const knownAngleDegrees = knownAngle * 180 / Math.PI
    return new CalculationProcedure({
      title: 'Caso SSA — Lado, Lado, Ángulo — sin solución',
      summary: 'SSA es el caso ambiguo; estos datos concretos no permiten formar un triángulo.',
      steps: [
        new CalculationStep({
          title: 'Interpretar el caso SSA',
          description: 'Se conocen dos lados y un ángulo no comprendido entre ellos.',
          formula: `\\text{SSA}=\\text{Side-Side-Angle}=\\text{Lado-Lado-Ángulo}`,
        }),
        new CalculationStep({
          title: `Convertir el ángulo ${selectedCase.angleKey} a radianes`,
          description: 'La conversión se realiza antes de evaluar las funciones trigonométricas internamente.',
          formula: `${selectedCase.angleKey}_{rad}=${number(knownAngleDegrees)}\\left(\\frac{\\pi}{180}\\right)=${number(knownAngle)}\\,rad`,
        }),
        new CalculationStep({
          title: 'Plantear la ley de senos',
          description: 'Se despeja el seno del ángulo desconocido utilizando los pares opuestos.',
          formula: `\\sin(${secondAngleKey})=\\frac{${selectedCase.secondSideKey}\\sin(${selectedCase.angleKey})}{${selectedCase.oppositeSideKey}}=${number(sineRatio)}`,
        }),
        new CalculationStep({
          title: 'Comprobar la existencia',
          description: 'El seno de un ángulo real siempre pertenece al intervalo de −1 a 1.',
          formula: `${number(sineRatio)}>1\\quad\\Rightarrow\\quad\\text{no existe un triángulo}`, 
        }),
      ],
    })
  }
}
