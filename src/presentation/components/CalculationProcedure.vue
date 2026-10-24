<script setup>
import MathFormula from './MathFormula.vue'

defineProps({
  procedure: { type: Object, required: true },
})
</script>

<template>
  <section class="min-w-0 max-w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-900 p-3 sm:p-5">
    <h3 class="text-lg font-semibold text-white">{{ procedure.title }}</h3>
    <p class="mt-1 text-sm text-slate-400">{{ procedure.summary }}</p>

    <div class="mt-4 min-w-0 space-y-3">
      <details
        v-for="(step, index) in procedure.steps"
        :key="`${step.title}-${index}`"
        class="group min-w-0 max-w-full rounded border border-slate-700 bg-slate-950"
      >
        <summary class="cursor-pointer px-2 py-3 font-medium text-slate-200 sm:px-4">
          <span class="mr-2 text-violet-400">{{ index + 1 }}.</span>{{ step.title }}
        </summary>
        <div class="min-w-0 border-t border-slate-800 px-2 py-3 sm:px-4">
          <p class="text-sm text-slate-400">{{ step.description }}</p>
          <MathFormula :formula="step.formula" />
        </div>
      </details>
    </div>
  </section>
</template>
