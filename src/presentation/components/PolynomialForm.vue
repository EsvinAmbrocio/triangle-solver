<script setup>
const props = defineProps({
  degree: { type: Number, required: true },
  coefficients: { type: Array, required: true },
  errors: { type: Object, default: () => ({}) },
  generalError: { type: String, default: '' },
})

const emit = defineEmits(['update:degree', 'update:coefficient', 'analyze', 'clear', 'example'])

function exponentFor(index) {
  return props.degree - index
}
</script>

<template>
  <form class="rounded-lg border border-slate-800 bg-slate-900 p-5" @submit.prevent="$emit('analyze')">
    <div class="flex flex-wrap items-end justify-between">
      <div>
        <h2 class="text-xl font-semibold text-white">Analizar polinomio</h2>
        <p class="mt-1 text-sm text-slate-400">Ingresa coeficientes enteros desde el término de mayor grado.</p>
      </div>
      <label class="mt-3 text-sm sm:mt-0">
        Grado
        <select
          :value="degree"
          class="ml-2 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          @change="$emit('update:degree', Number($event.target.value))"
        >
          <option v-for="value in [2, 3, 4, 5]" :key="value" :value="value">{{ value }}</option>
        </select>
      </label>
    </div>

    <div class="mt-5 grid sm:grid-cols-3 lg:grid-cols-6">
      <label
        v-for="(coefficient, index) in coefficients"
        :key="`${degree}-${index}`"
        class="mt-3 block sm:mx-1.5 sm:first:ml-0 sm:last:mr-0"
      >
        <span class="mb-1 block text-sm text-slate-300">
          {{ exponentFor(index) === 0 ? 'Constante' : `Coef. x^${exponentFor(index)}` }}
        </span>
        <input
          :value="coefficient"
          type="number"
          step="1"
          class="max-w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          @input="$emit('update:coefficient', index, $event.target.value)"
        >
        <span v-if="errors[index]" class="mt-1 block text-xs text-rose-400">{{ errors[index] }}</span>
      </label>
    </div>

    <p v-if="generalError" class="mt-4 rounded border border-rose-700 bg-rose-950 p-3 text-sm text-rose-300">
      {{ generalError }}
    </p>

    <div class="mt-5 flex flex-wrap">
      <button type="submit" class="rounded bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-500">
        Analizar polinomio
      </button>
      <button type="button" class="ml-2 rounded border border-slate-700 px-4 py-2" @click="$emit('clear')">
        Limpiar
      </button>
      <button type="button" class="ml-2 rounded border border-slate-700 px-4 py-2" @click="$emit('example')">
        Cargar ejemplo
      </button>
    </div>
  </form>
</template>
