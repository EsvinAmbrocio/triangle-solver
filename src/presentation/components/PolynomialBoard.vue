<script setup>
import { toRef, useId } from 'vue'
import { usePolynomialGraph } from '../composables/usePolynomialGraph.js'

const props = defineProps({
  analysis: { type: Object, default: null },
})

const boardId = `polynomial-board-${useId().replaceAll(':', '')}`
usePolynomialGraph(boardId, toRef(props, 'analysis'))
</script>

<template>
  <section class="mt-6 overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
    <div class="border-b border-slate-800 px-4 py-3">
      <h2 class="font-semibold text-white">Gráfica del polinomio</h2>
      <p class="mt-1 text-sm text-slate-400">
        Verde: P(x) ≥ 0. Rojo: P(x) &lt; 0.
      </p>
    </div>
    <div :id="boardId" class="jxgbox h-96 max-w-full bg-white" />
  </section>
</template>
