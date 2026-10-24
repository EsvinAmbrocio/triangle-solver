<script setup>
import { computed, toRef, useId } from 'vue'
import { useTriangleGraph } from '../composables/useTriangleGraph.js'

const props = defineProps({
  triangle: { type: Object, default: null },
  title: { type: String, default: 'Vista del triángulo' },
})

const boardId = `triangle-board-${useId().replaceAll(':', '')}`
const triangleReference = toRef(props, 'triangle')
const accessibleLabel = computed(() => `${props.title}. Vértices A, B y C.`)

useTriangleGraph(boardId, triangleReference)
</script>

<template>
  <section class="min-w-0 max-w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
    <div class="border-b border-slate-800 px-5 py-4">
      <h2 class="font-semibold text-white">{{ title }}</h2>
    </div>
    <div
      :id="boardId"
      class="jxgbox h-72 min-w-0 max-w-full rounded-b-lg border-0 bg-white sm:h-80"
      role="img"
      :aria-label="accessibleLabel"
    />
  </section>
</template>
