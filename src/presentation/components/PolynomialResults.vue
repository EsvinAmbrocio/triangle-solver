<script setup>
import CalculationProcedure from './CalculationProcedure.vue'
import MathFormula from './MathFormula.vue'
import PolynomialBoard from './PolynomialBoard.vue'

defineProps({ result: { type: Object, required: true } })

function rootLabel(root) {
  if (root.exact) return root.exact.toString()
  if (root.type === 'complex') {
    const sign = root.imaginary < 0 ? '-' : '+'
    return `${root.real.toFixed(4)} ${sign} ${Math.abs(root.imaginary).toFixed(4)}i`
  }
  return root.approximate.toFixed(4)
}
</script>

<template>
  <section class="mt-8 min-w-0">
    <div class="rounded-lg border border-slate-800 bg-slate-900 p-5">
      <h2 class="text-xl font-semibold text-white">Resultados</h2>
      <MathFormula :formula="`P(x)=${result.polynomialLatex}`" />

      <div class="mt-4 border-t border-slate-800 pt-4">
        <h3 class="font-semibold text-white">Raíces racionales encontradas</h3>
        <ul v-if="result.rationalRoots.length" class="mt-2 text-sm text-slate-300">
          <li v-for="root in result.rationalRoots" :key="root.value.toString()" class="mt-1">
            x = {{ root.value.toString() }} · multiplicidad {{ root.multiplicity }}
          </li>
        </ul>
        <p v-else class="mt-2 text-sm text-slate-400">No se encontraron raíces racionales por división sintética.</p>
      </div>

      <div v-if="result.quadraticResult" class="mt-4 border-t border-slate-800 pt-4">
        <h3 class="font-semibold text-white">Raíces del factor cuadrático</h3>
        <p class="mt-2 text-sm text-slate-300">
          {{ result.quadraticResult.roots.map(rootLabel).join(' , ') }}
        </p>
      </div>

      <div class="mt-4 border-t border-slate-800 pt-4">
        <h3 class="font-semibold text-white">Polinomio restante</h3>
        <p class="mt-1 text-sm text-slate-400">Grado restante: {{ result.reducedPolynomial.degree }}</p>
        <MathFormula :formula="`F(x)=${result.factorsLatex}`" />
        <MathFormula :formula="`R(x)=${result.reducedPolynomialLatex}`" />
        <p v-if="result.unresolved" class="text-sm text-amber-300">
          El factor restante no tiene raíces racionales y no puede resolverse con los métodos exigidos.
        </p>
      </div>
    </div>

    <PolynomialBoard :analysis="result" />
    <div class="mt-6"><CalculationProcedure :procedure="result.procedure" /></div>
  </section>
</template>
