<script setup>
import PolynomialForm from './PolynomialForm.vue'
import PolynomialResults from './PolynomialResults.vue'
import { usePolynomialAnalyzer } from '../composables/usePolynomialAnalyzer.js'

const props = defineProps({ applicationService: { type: Object, required: true } })
const {
  degree, coefficients, result, errors, generalError,
  setDegree, updateCoefficient, analyze, clear, loadExample,
} = usePolynomialAnalyzer(props.applicationService)
</script>

<template>
  <div>
    <PolynomialForm
      :degree="degree"
      :coefficients="coefficients"
      :errors="errors"
      :general-error="generalError"
      @update:degree="setDegree"
      @update:coefficient="updateCoefficient"
      @analyze="analyze"
      @clear="clear"
      @example="loadExample"
    />
    <PolynomialResults v-if="result" :result="result" />
  </div>
</template>
