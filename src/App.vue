<script setup>
import { ref } from 'vue'
import { AngleConversionApplicationService } from './application/services/AngleConversionApplicationService.js'
import { PolynomialApplicationService } from './application/services/PolynomialApplicationService.js'
import { TriangleApplicationService } from './application/services/TriangleApplicationService.js'
import { AngleConverter as AngleConverterDomain } from './domain/angle-conversion/AngleConverter.js'
import { PolynomialAnalyzer } from './domain/polynomials/services/PolynomialAnalyzer.js'
import { PolynomialFormatter } from './domain/polynomials/services/PolynomialFormatter.js'
import { QuadraticSolver } from './domain/polynomials/services/QuadraticSolver.js'
import { RationalRootTheorem } from './domain/polynomials/services/RationalRootTheorem.js'
import { SyntheticDivision } from './domain/polynomials/services/SyntheticDivision.js'
import { TriangleSolver } from './domain/services/TriangleSolver.js'
import { ASAAStrategy } from './domain/strategies/ASAAStrategy.js'
import { SASStrategy } from './domain/strategies/SASStrategy.js'
import { SSAStrategy } from './domain/strategies/SSAStrategy.js'
import { SSSStrategy } from './domain/strategies/SSSStrategy.js'
import { TriangleValidator } from './domain/validation/TriangleValidator.js'
import AngleConverter from './presentation/components/AngleConverter.vue'
import PolynomialModule from './presentation/components/PolynomialModule.vue'
import TriangleBoard from './presentation/components/TriangleBoard.vue'
import TriangleForm from './presentation/components/TriangleForm.vue'
import TriangleResults from './presentation/components/TriangleResults.vue'
import { useTriangleSolver } from './presentation/composables/useTriangleSolver.js'

const validator = new TriangleValidator()
const solver = new TriangleSolver([
  new SSSStrategy(),
  new SASStrategy(),
  new ASAAStrategy(),
  new SSAStrategy(),
], validator)
const applicationService = new TriangleApplicationService(solver)
const rationalRootTheorem = new RationalRootTheorem()
const polynomialApplicationService = new PolynomialApplicationService(
  new PolynomialAnalyzer(rationalRootTheorem, new SyntheticDivision(), new QuadraticSolver()),
  new PolynomialFormatter(),
  rationalRootTheorem,
)
const angleConversionApplicationService = new AngleConversionApplicationService(new AngleConverterDomain())
const activeModule = ref('triangles')

const {
  fields,
  fieldErrors,
  generalError,
  result,
  isSolving,
  solve,
} = useTriangleSolver(applicationService)

function updateFields(updatedFields) {
  Object.assign(fields, updatedFields)
}
</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-slate-950 text-slate-300">
    <header class="border-b border-slate-800 bg-slate-900">
      <div class="mx-auto max-w-[1180px] px-4 py-6">
        <div>
          <h1 class="text-3xl font-bold text-white">Herramientas de Precálculo</h1>
          <p class="mt-1 text-slate-400">
            Triángulos, polinomios y conversión de ángulos.
          </p>
          <nav class="mt-5">
            <button
              v-for="module in [
                { key: 'triangles', label: 'Triángulos' },
                { key: 'polynomials', label: 'Polinomios' },
                { key: 'angles', label: 'Conversor de ángulos' },
              ]"
              :key="module.key"
              type="button"
              :class="[
                'mr-2 mt-2 rounded px-4 py-2 text-sm font-semibold',
                activeModule === module.key
                  ? 'bg-violet-600 text-white'
                  : 'border border-slate-700 text-slate-300',
              ]"
              @click="activeModule = module.key"
            >
              {{ module.label }}
            </button>
          </nav>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-[1180px] px-4 py-8">
      <template v-if="activeModule === 'triangles'">
      <div class="grid min-w-0 items-start lg:grid-cols-2">
        <section class="min-w-0 rounded-lg border border-slate-800 bg-slate-900 p-5 sm:p-6 lg:mr-3">
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-white">Datos del triángulo</h2>
            <p class="mt-1 text-sm text-slate-400">Completa al menos tres datos compatibles.</p>
          </div>
          <TriangleForm
            :model-value="fields"
            :errors="fieldErrors"
            :general-error="generalError"
            :is-solving="isSolving"
            @update:model-value="updateFields"
            @solve="solve"
          />
        </section>

        <TriangleBoard
          v-if="!result"
          class="mt-6 lg:ml-3 lg:mt-0"
          title="Triángulo ilustrativo"
        />
        <aside v-else class="mt-6 min-w-0 rounded-lg border border-slate-800 bg-slate-900 p-5 text-sm text-slate-400 lg:ml-3 lg:mt-0">
          <h2 class="font-semibold text-white">Cálculo completado</h2>
          <p class="mt-2">Los valores escritos permanecen en el formulario. Los resultados se muestran por separado debajo.</p>
        </aside>
      </div>

      <div v-if="result" class="mt-8 min-w-0 border-t border-slate-800 pt-8">
        <TriangleResults :result="result" />
      </div>
      </template>

      <PolynomialModule
        v-else-if="activeModule === 'polynomials'"
        :application-service="polynomialApplicationService"
      />

      <AngleConverter
        v-else
        :application-service="angleConversionApplicationService"
      />
    </main>

    <footer class="w-auto max-w-full overflow-hidden border-t border-slate-800">
      <div class="mx-auto max-w-[1180px] px-4 py-6 text-center text-sm text-slate-500">
        Herramientas de Precálculo · Aplicación universitaria
      </div>
    </footer>
  </div>
</template>
