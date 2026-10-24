import { reactive, ref, shallowRef } from 'vue'
import { AngleSource } from '../../domain/angle-conversion/AngleSource.js'
import { DomainError } from '../../domain/errors/DomainError.js'

export function useAngleConverter(applicationService) {
  const source = ref(AngleSource.DECIMAL_DEGREES)
  const fields = reactive({ decimalDegrees: '', radians: '' })
  const errors = reactive({})
  const generalError = ref('')
  const result = shallowRef(null)

  function clearErrors() {
    Object.keys(errors).forEach((key) => delete errors[key])
    generalError.value = ''
  }

  function convert() {
    clearErrors()
    try {
      result.value = applicationService.convert(source.value, { ...fields })
    } catch (error) {
      result.value = null
      if (error instanceof DomainError) {
        if (error.field) errors[error.field] = error.message
        else generalError.value = error.message
      } else {
        generalError.value = 'No fue posible convertir el ángulo.'
        console.error(error)
      }
    }
  }

  function clear() {
    Object.keys(fields).forEach((key) => { fields[key] = '' })
    clearErrors()
    result.value = null
  }

  return { source, fields, errors, generalError, result, convert, clear, AngleSource }
}
