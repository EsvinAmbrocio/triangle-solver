import { Trigonometry } from '../math/Trigonometry.js'
import { CalculationProcedure } from '../procedures/CalculationProcedure.js'
import { CalculationStep } from '../procedures/CalculationStep.js'
import { TriangleStrategy } from './TriangleStrategy.js'
import { angleKeys, createCompleteTriangle, number, sideKeys } from './strategyHelpers.js'

export class ASAAStrategy extends TriangleStrategy {
  constructor() {
    super('ASA/AAS')
  }

  supports(triangle) {
    const angleCount = angleKeys.filter((key) => triangle[key]).length
    const sideCount = sideKeys.filter((key) => triangle[key]).length
    return angleCount >= 2 && sideCount >= 1
  }

  solve(triangle) {
    const knownAngles = angleKeys.filter((key) => triangle[key])
    const missingAngle = angleKeys.find((key) => !triangle[key])
    const angles = Object.fromEntries(
      knownAngles.map((key) => [key, triangle[key].radians]),
    )

    if (missingAngle) {
      angles[missingAngle] = Math.PI - angles[knownAngles[0]] - angles[knownAngles[1]]
    }

    const referenceSideKey = sideKeys.find((key) => triangle[key])
    const referenceAngleKey = referenceSideKey.toUpperCase()
    const referenceSide = triangle[referenceSideKey].value
    const caseName = missingAngle && referenceSideKey === missingAngle.toLowerCase()
      ? 'ASA'
      : 'AAS'
    const caseTranslation = caseName === 'ASA'
      ? 'Ángulo-Lado-Ángulo'
      : 'Ángulo-Ángulo-Lado'
    const sides = {}

    for (const sideKey of sideKeys) {
      sides[sideKey] = sideKey === referenceSideKey
        ? referenceSide
        : Trigonometry.sideBySineLaw(referenceSide, angles[sideKey.toUpperCase()], angles[referenceAngleKey])
    }

    const solution = createCompleteTriangle({ ...sides, ...angles })
    const calculatedAngleKey = missingAngle ?? knownAngles[2]
    const calculatedSides = sideKeys.filter((key) => key !== referenceSideKey)

    const procedure = new CalculationProcedure({
      title: `Solución ${caseName} — ${caseTranslation}`,
      summary: `Se reconoció el caso ${caseName}: hay dos ángulos y un lado conocidos.`,
      steps: [
        new CalculationStep({
          title: `Interpretar el caso ${caseName}`,
          description: caseName === 'ASA'
            ? 'El lado conocido está situado entre los dos ángulos conocidos.'
            : 'El lado conocido no está situado entre los dos ángulos conocidos.',
          formula: `\\begin{aligned}\\text{${caseName}}&=\\text{${caseName === 'ASA' ? 'Angle-Side-Angle' : 'Angle-Angle-Side'}}\\\\&=\\text{${caseTranslation}}\\\\${knownAngles[0]}&=${number(solution[knownAngles[0]].degrees)}^\\circ,\\quad ${knownAngles[1]}=${number(solution[knownAngles[1]].degrees)}^\\circ,\\quad ${referenceSideKey}=${number(referenceSide)}\\end{aligned}`,
        }),
        new CalculationStep({
          title: 'Completar los ángulos',
          description: 'Los ángulos interiores suman 180°.',
          formula: `\\begin{aligned}${calculatedAngleKey}&=180^\\circ-${knownAngles[0]}-${knownAngles[1]}\\\\&=180^\\circ-${number(solution[knownAngles[0]].degrees)}^\\circ-${number(solution[knownAngles[1]].degrees)}^\\circ\\\\&=${number(solution[calculatedAngleKey].degrees)}^\\circ\\end{aligned}`,
        }),
        new CalculationStep({
          title: 'Establecer la razón de referencia',
          description: `El lado ${referenceSideKey} y el ángulo ${referenceAngleKey} forman el par opuesto conocido.`,
          formula: `\\frac{${referenceSideKey}}{\\sin(${referenceAngleKey})}=\\frac{${number(referenceSide)}}{\\sin(${number(solution[referenceAngleKey].degrees)}^\\circ)}`,
        }),
        ...calculatedSides.map((sideKey) => new CalculationStep({
          title: `Calcular el lado ${sideKey}`,
          description: 'Se utiliza la proporción entre lados y senos de ángulos opuestos.',
          formula: `\\begin{aligned}\\frac{${sideKey}}{\\sin(${sideKey.toUpperCase()})}&=\\frac{${referenceSideKey}}{\\sin(${referenceAngleKey})}\\\\${sideKey}&=\\frac{${referenceSideKey}\\sin(${sideKey.toUpperCase()})}{\\sin(${referenceAngleKey})}\\\\&=\\frac{${number(referenceSide)}\\sin(${number(solution[sideKey.toUpperCase()].degrees)}^\\circ)}{\\sin(${number(solution[referenceAngleKey].degrees)}^\\circ)}\\\\&=${number(solution[sideKey].value)}\\end{aligned}`,
        })),
        new CalculationStep({
          title: 'Convertir los ángulos a radianes',
          description: 'Se convierte cada ángulo con θ(rad) = θ(°) · π/180.',
          formula: `\\begin{aligned}A_{rad}&=${number(solution.A.degrees)}\\left(\\frac{\\pi}{180}\\right)=${number(solution.A.radians)}\\,rad\\\\B_{rad}&=${number(solution.B.degrees)}\\left(\\frac{\\pi}{180}\\right)=${number(solution.B.radians)}\\,rad\\\\C_{rad}&=${number(solution.C.degrees)}\\left(\\frac{\\pi}{180}\\right)=${number(solution.C.radians)}\\,rad\\end{aligned}`,
        }),
        new CalculationStep({
          title: 'Comprobar la solución',
          description: 'Se verifica que la suma de los ángulos sea 180°.',
          formula: `${number(solution.A.degrees)}^\\circ+${number(solution.B.degrees)}^\\circ+${number(solution.C.degrees)}^\\circ=180.000000^\\circ`,
        }),
      ],
    })

    return { strategy: this.name, solutions: [{ triangle: solution, procedure }] }
  }
}
