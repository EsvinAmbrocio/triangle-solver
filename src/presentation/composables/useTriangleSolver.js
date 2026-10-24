import { reactive, shallowRef } from 'vue'
import { DomainError } from '../../domain/errors/DomainError.js'
import { AngleUnit } from '../../domain/value-objects/AngleUnit.js'

const EMPTY_FIELDS = {
  a: '',
  b: '',
  c: '',
  A: '',
  B: '',
  C: '',
  angleUnit: AngleUnit.DEGREES,
}

export function useTriangleSolver(applicationService) {
  const fields = reactive({ ...EMPTY_FIELDS })
  const fieldErrors = reactive({})
  const generalError = shallowRef('')
  const result = shallowRef(null)
  const isSolving = shallowRef(false)

  function clearErrors() {
    for (const key of Object.keys(fieldErrors)) delete fieldErrors[key]
    generalError.value = ''
  }

  function solve() {
    clearErrors()
    isSolving.value = true

    try {
      result.value = applicationService.solve({ ...fields })
    } catch (error) {
      result.value = null

      if (error instanceof DomainError) {
        if (error.field) fieldErrors[error.field] = error.message
        else generalError.value = error.message
      } else {
        generalError.value = 'Ocurrió un error inesperado al resolver el triángulo.'
        console.error(error)
      }
    } finally {
      isSolving.value = false
    }
  }

  return {
    fields,
    fieldErrors,
    generalError,
    result,
    isSolving,
    solve,
  }
}
