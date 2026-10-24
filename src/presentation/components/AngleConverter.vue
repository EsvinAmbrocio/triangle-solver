<script setup>
import CalculationProcedure from './CalculationProcedure.vue'
import { useAngleConverter } from '../composables/useAngleConverter.js'

const props = defineProps({ applicationService: { type: Object, required: true } })
const { source, fields, errors, generalError, result, convert, clear, AngleSource } = useAngleConverter(props.applicationService)
</script>

<template>
  <div>
    <form class="rounded-lg border border-slate-800 bg-slate-900 p-5" @submit.prevent="convert">
      <h2 class="text-xl font-semibold text-white">Conversor de ángulos</h2>
      <p class="mt-1 text-sm text-slate-400">Convierte grados decimales y radianes.</p>

      <label class="mt-5 block text-sm text-slate-300">
        Convertir desde
        <select v-model="source" class="ml-2 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white">
          <option :value="AngleSource.DECIMAL_DEGREES">Grados decimales</option>
          <option :value="AngleSource.RADIANS">Radianes</option>
        </select>
      </label>

      <div v-if="source === AngleSource.DECIMAL_DEGREES" class="mt-5">
        <label class="block text-sm">Grados decimales</label>
        <input v-model="fields.decimalDegrees" type="number" step="any" class="mt-1 max-w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white">
        <span v-if="errors.decimalDegrees" class="ml-2 text-xs text-rose-400">{{ errors.decimalDegrees }}</span>
      </div>

      <div v-else class="mt-5">
        <label class="block text-sm">Radianes</label>
        <input v-model="fields.radians" type="number" step="any" class="mt-1 max-w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white">
        <span v-if="errors.radians" class="ml-2 text-xs text-rose-400">{{ errors.radians }}</span>
      </div>

      <p v-if="generalError" class="mt-4 text-sm text-rose-400">{{ generalError }}</p>
      <div class="mt-5">
        <button type="submit" class="rounded bg-violet-600 px-4 py-2 font-semibold text-white">Convertir</button>
        <button type="button" class="ml-2 rounded border border-slate-700 px-4 py-2" @click="clear">Limpiar</button>
      </div>
    </form>

    <section v-if="result" class="mt-6 rounded-lg border border-slate-800 bg-slate-900 p-5">
      <h2 class="text-xl font-semibold text-white">Resultados</h2>
      <dl class="mt-4">
        <div class="py-2"><dt class="text-sm text-slate-400">Grados decimales</dt><dd class="text-white">{{ result.decimalDegrees.toFixed(8) }}°</dd></div>
        <div class="border-t border-slate-800 py-2"><dt class="text-sm text-slate-400">Radianes</dt><dd class="text-white">{{ result.radians.toFixed(10) }} rad</dd></div>
      </dl>
    </section>

    <div v-if="result" class="mt-6"><CalculationProcedure :procedure="result.procedure" /></div>
  </div>
</template>
