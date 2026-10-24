import { ref, shallowRef } from 'vue'
import { DomainError } from '../../domain/errors/DomainError.js'

const EXAMPLE_COEFFICIENTS = ['2', '-5', '5', '15', '-47', '30']

export function usePolynomialAnalyzer(applicationService) {
  const degree = ref(5)
  const coefficients = ref([...EXAMPLE_COEFFICIENTS])
  const result = shallowRef(null)
  const errors = ref({})
  const generalError = ref('')

  function setDegree(value) {
    const nextDegree = Number(value)
    degree.value = nextDegree
    coefficients.value = Array.from(
      { length: nextDegree + 1 },
      (_, index) => coefficients.value[index] ?? '',
    )
    result.value = null
  }

  function updateCoefficient(index, value) {
    coefficients.value = coefficients.value.map((coefficient, currentIndex) => (
      currentIndex === index ? value : coefficient
    ))
  }

  function analyze() {
    errors.value = {}
    generalError.value = ''
    try {
      const emptyIndex = coefficients.value.findIndex((value) => String(value).trim() === '')
      if (emptyIndex >= 0) {
        errors.value = { [emptyIndex]: 'Ingresa un coeficiente entero.' }
        result.value = null
        return
      }
      result.value = applicationService.analyze(coefficients.value)
    } catch (error) {
      result.value = null
      if (error instanceof DomainError) {
        const index = error.field?.startsWith('coefficients.')
          ? Number(error.field.split('.')[1])
          : null
        if (index !== null) errors.value = { [index]: error.message }
        else generalError.value = error.message
      } else {
        generalError.value = 'No fue posible analizar el polinomio.'
        console.error(error)
      }
    }
  }

  function clear() {
    coefficients.value = Array(degree.value + 1).fill('')
    result.value = null
    errors.value = {}
    generalError.value = ''
  }

  function loadExample() {
    degree.value = 5
    coefficients.value = [...EXAMPLE_COEFFICIENTS]
    result.value = null
    errors.value = {}
    generalError.value = ''
  }

  return {
    degree,
    coefficients,
    result,
    errors,
    generalError,
    setDegree,
    updateCoefficient,
    analyze,
    clear,
    loadExample,
  }
}
