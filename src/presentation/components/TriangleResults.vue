<script setup>
import CalculationProcedure from './CalculationProcedure.vue'
import TriangleSolution from './TriangleSolution.vue'

defineProps({
  result: { type: Object, required: true },
})
</script>

<template>
  <section class="min-w-0 max-w-full space-y-8" aria-live="polite">
    <div class="flex flex-wrap items-center border-b border-slate-800 pb-4">
      <h2 class="text-2xl font-bold text-white">Solución</h2>
      <span class="ml-3 text-sm text-slate-400">
        Método {{ result.strategy }}
      </span>
    </div>

    <div v-if="result.solutions.length" class="min-w-0 space-y-10">
      <TriangleSolution
        v-for="(solution, index) in result.solutions"
        :key="index"
        :solution="solution"
        :index="index"
        :total="result.solutions.length"
      />
    </div>

    <div v-else class="space-y-6">
      <div class="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-amber-200">
        <h3 class="font-semibold">No existe un triángulo con estos datos</h3>
        <p class="mt-1 text-sm text-amber-200/70">El caso SSA produce cero soluciones.</p>
      </div>
      <CalculationProcedure v-if="result.emptyProcedure" :procedure="result.emptyProcedure" />
    </div>
  </section>
</template>
