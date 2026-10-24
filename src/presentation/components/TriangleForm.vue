<script setup>
import { AngleUnit } from '../../domain/value-objects/AngleUnit.js'

const props = defineProps({
  modelValue: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  generalError: { type: String, default: '' },
  isSolving: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'solve'])

const sideFields = [
  { key: 'a', label: 'Lado a' },
  { key: 'b', label: 'Lado b' },
  { key: 'c', label: 'Lado c' },
]

const angleFields = [
  { key: 'A', label: 'Ángulo A' },
  { key: 'B', label: 'Ángulo B' },
  { key: 'C', label: 'Ángulo C' },
]

function updateField(field, value) {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="$emit('solve')">
    <div>
      <div class="mb-3 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-white">Lados conocidos</h2>
          <p class="text-sm text-slate-400">Usa unidades consistentes.</p>
        </div>
      </div>
      <div class="grid sm:grid-cols-3">
        <label v-for="field in sideFields" :key="field.key" class="mt-4 block first:mt-0 sm:mx-2 sm:mt-0 sm:first:ml-0 sm:last:mr-0">
          <span class="mb-1.5 block text-sm font-medium text-slate-300">{{ field.label }}</span>
          <input
            :value="modelValue[field.key]"
            type="number"
            min="0"
            step="any"
            :aria-invalid="Boolean(errors[field.key])"
            class="max-w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none placeholder:text-slate-600 focus:border-violet-500 aria-invalid:border-rose-400"
            :placeholder="field.key"
            @input="updateField(field.key, $event.target.value)"
          >
          <span v-if="errors[field.key]" class="mt-1.5 block text-xs text-rose-400">
            {{ errors[field.key] }}
          </span>
        </label>
      </div>
    </div>

    <div>
      <div class="mb-3 flex flex-wrap items-end justify-between">
        <div>
          <h2 class="text-lg font-semibold text-white">Ángulos conocidos</h2>
          <p class="text-sm text-slate-400">Cada ángulo debe ser interior.</p>
        </div>
        <label class="mt-3 text-sm text-slate-300 sm:ml-3 sm:mt-0">
          Unidad
          <select
            :value="modelValue.angleUnit"
            class="ml-2 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-violet-500"
            @change="updateField('angleUnit', $event.target.value)"
          >
            <option :value="AngleUnit.DEGREES">Grados</option>
            <option :value="AngleUnit.RADIANS">Radianes</option>
          </select>
        </label>
      </div>
      <div class="grid sm:grid-cols-3">
        <label v-for="field in angleFields" :key="field.key" class="mt-4 block first:mt-0 sm:mx-2 sm:mt-0 sm:first:ml-0 sm:last:mr-0">
          <span class="mb-1.5 block text-sm font-medium text-slate-300">{{ field.label }}</span>
          <input
            :value="modelValue[field.key]"
            type="number"
            step="any"
            :aria-invalid="Boolean(errors[field.key])"
            class="max-w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none placeholder:text-slate-600 focus:border-violet-500 aria-invalid:border-rose-400"
            :placeholder="field.key"
            @input="updateField(field.key, $event.target.value)"
          >
          <span v-if="errors[field.key]" class="mt-1.5 block text-xs text-rose-400">
            {{ errors[field.key] }}
          </span>
        </label>
      </div>
    </div>

    <p v-if="generalError" role="alert" class="rounded border border-rose-700 bg-rose-950 p-3 text-sm text-rose-300">
      {{ generalError }}
    </p>

    <button
      type="submit"
      :disabled="isSolving"
      class="w-full rounded-lg bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:cursor-wait disabled:opacity-60"
    >
      {{ isSolving ? 'Resolviendo…' : 'Resolver triángulo' }}
    </button>
  </form>
</template>
