<script setup>
import { computed } from 'vue'
import katex from 'katex'

const props = defineProps({
  formula: { type: String, required: true },
})

const renderedFormula = computed(() => katex.renderToString(props.formula, {
  throwOnError: false,
  displayMode: true,
}))
</script>

<template>
  <div
    class="max-w-full overflow-x-auto py-2 text-[10px] text-violet-100 sm:text-base"
    v-html="renderedFormula"
  />
</template>
