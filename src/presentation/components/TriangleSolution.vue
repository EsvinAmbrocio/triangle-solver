<script setup>
import CalculationProcedure from './CalculationProcedure.vue'
import TriangleBoard from './TriangleBoard.vue'

const props = defineProps({
  solution: { type: Object, required: true },
  index: { type: Number, default: 0 },
  total: { type: Number, default: 1 },
})

const sideKeys = ['a', 'b', 'c']
const angleKeys = ['A', 'B', 'C']

function format(value) {
  return Number(value).toFixed(4)
}
</script>

<template>
  <article class="min-w-0 max-w-full space-y-6">
    <div v-if="total > 1" class="flex items-center">
      <span class="text-sm font-semibold text-violet-300">
        Solución {{ index + 1 }} de {{ total }}
      </span>
      <div class="ml-3 h-px flex-1 bg-slate-800" />
    </div>

    <div class="grid min-w-0 lg:grid-cols-2">
      <TriangleBoard
        :triangle="solution.triangle"
        class="lg:mr-3"
        :title="total > 1 ? `Triángulo ${index + 1}` : 'Triángulo resuelto'"
      />

      <section class="mt-6 min-w-0 rounded-lg border border-slate-800 bg-slate-900 p-5 lg:ml-3 lg:mt-0">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="font-semibold text-white">Resultados numéricos</h2>
          <span class="text-xs text-slate-500">4 decimales</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3">
          <div v-for="key in sideKeys" :key="key" class="mt-3 min-w-0 rounded-md border border-slate-800 bg-slate-950 p-3 text-center first:mt-0 sm:mx-1.5 sm:mt-0 sm:first:ml-0 sm:last:mr-0">
            <span class="text-xs uppercase tracking-wider text-slate-500">Lado {{ key }}</span>
            <strong class="mt-1 block text-lg text-white">{{ format(solution.triangle[key].value) }}</strong>
          </div>
        </div>

        <div class="mt-3 grid grid-cols-1 sm:grid-cols-3">
          <div v-for="key in angleKeys" :key="key" class="mt-3 min-w-0 rounded-md border border-slate-800 bg-slate-950 p-3 text-center first:mt-0 sm:mx-1.5 sm:mt-0 sm:first:ml-0 sm:last:mr-0">
            <span class="text-xs uppercase tracking-wider text-slate-500">Ángulo {{ key }}</span>
            <strong class="mt-1 block text-lg text-white">{{ format(solution.triangle[key].degrees) }}°</strong>
            <span class="mt-0.5 block text-xs text-slate-500">{{ format(solution.triangle[key].radians) }} rad</span>
          </div>
        </div>
      </section>
    </div>

    <CalculationProcedure :procedure="solution.procedure" />
  </article>
</template>
