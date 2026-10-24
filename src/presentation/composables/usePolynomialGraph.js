import { onBeforeUnmount, onMounted, watch } from 'vue'
import JXG from 'jsxgraph'

export function usePolynomialGraph(boardId, analysisReference) {
  let board = null

  function evaluate(coefficients, x) {
    return coefficients.reduce((value, coefficient) => value * x + coefficient, 0)
  }

  function draw(analysis) {
    if (board) JXG.JSXGraph.freeBoard(board)
    if (!analysis) return

    const coefficients = analysis.originalPolynomial.toNumberArray()
    const roots = [...new Set(analysis.realRoots.map((root) => Number(root.toFixed(10))))]
      .sort((first, second) => first - second)
    const xMinimum = roots.length ? Math.min(-5, roots[0] - 2) : -5
    const xMaximum = roots.length ? Math.max(5, roots[roots.length - 1] + 2) : 5
    const sampleCount = 500
    const xs = []
    const ys = []

    for (let index = 0; index <= sampleCount; index += 1) {
      const x = xMinimum + (xMaximum - xMinimum) * index / sampleCount
      xs.push(x)
      ys.push(evaluate(coefficients, x))
    }

    const sortedMagnitudes = ys.map(Math.abs).filter(Number.isFinite).sort((a, b) => a - b)
    const percentile = sortedMagnitudes[Math.floor(sortedMagnitudes.length * 0.8)] ?? 10
    const yLimit = Math.max(5, Math.min(100, percentile * 1.25))

    board = JXG.JSXGraph.initBoard(boardId, {
      boundingbox: [xMinimum, yLimit, xMaximum, -yLimit],
      axis: true,
      grid: true,
      showCopyright: false,
      showNavigation: true,
      keepAspectRatio: false,
      pan: { enabled: true },
      zoom: { enabled: true, wheel: true },
    })

    board.create('curve', [xs, ys.map((value) => value >= 0 ? value : Number.NaN)], {
      strokeColor: '#16a34a',
      strokeWidth: 3,
      highlight: false,
    })
    board.create('curve', [xs, ys.map((value) => value < 0 ? value : Number.NaN)], {
      strokeColor: '#dc2626',
      strokeWidth: 3,
      highlight: false,
    })

    for (const root of roots) {
      board.create('point', [root, 0], {
        name: `(${root.toFixed(4)}, 0)`,
        fixed: true,
        size: 3,
        strokeColor: '#6d28d9',
        fillColor: '#8b5cf6',
        label: { color: '#111827', offset: [8, 12] },
      })
    }
  }

  onMounted(() => draw(analysisReference.value))
  watch(analysisReference, draw)
  onBeforeUnmount(() => {
    if (board) JXG.JSXGraph.freeBoard(board)
  })
}
