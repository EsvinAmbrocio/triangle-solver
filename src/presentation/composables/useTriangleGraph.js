import { onBeforeUnmount, onMounted, watch } from 'vue'
import JXG from 'jsxgraph'

export function useTriangleGraph(boardId, triangleReference) {
  let board = null

  function getCoordinates(triangle) {
    if (!triangle) {
      return [[0, 0], [1, 0], [0.5, Math.sqrt(3) / 2]]
    }

    const a = triangle.a.value
    const b = triangle.b.value
    const c = triangle.c.value
    const x = (b ** 2 + c ** 2 - a ** 2) / (2 * c)
    const y = Math.sqrt(Math.max(0, b ** 2 - x ** 2))
    return [[0, 0], [c, 0], [x, y]]
  }

  function draw(triangle) {
    if (board) JXG.JSXGraph.freeBoard(board)

    const coordinates = getCoordinates(triangle)
    const xs = coordinates.map(([x]) => x)
    const ys = coordinates.map(([, y]) => y)
    const width = Math.max(...xs) - Math.min(...xs) || 1
    const height = Math.max(...ys) - Math.min(...ys) || 1
    const padding = Math.max(width, height) * 0.28

    board = JXG.JSXGraph.initBoard(boardId, {
      boundingbox: [
        Math.min(...xs) - padding,
        Math.max(...ys) + padding,
        Math.max(...xs) + padding,
        Math.min(...ys) - padding,
      ],
      axis: true,
      showCopyright: true,
      showNavigation: false,
      keepAspectRatio: true,
      pan: { enabled: false },
      zoom: { enabled: false },
    })

    const pointOptions = {
      fixed: true,
      withLabel: true,
      size: 4,
      strokeColor: '#a78bfa',
      fillColor: '#7c3aed',
      highlight: false,
      label: { color: '#111827', fontSize: 16, offset: [10, 8] },
    }
    const points = coordinates.map((coordinate, index) => (
      board.create('point', coordinate, { ...pointOptions, name: ['A', 'B', 'C'][index] })
    ))

    board.create('polygon', points, {
      borders: { strokeColor: '#8b5cf6', strokeWidth: 3, highlight: false },
      fillColor: '#7c3aed',
      fillOpacity: 0.16,
      highlight: false,
      vertices: { visible: true },
    })

    const centroid = coordinates.reduce(
      ([sumX, sumY], [x, y]) => [sumX + x / 3, sumY + y / 3],
      [0, 0],
    )
    const sideLabels = [
      { name: 'a', vertices: [coordinates[1], coordinates[2]] },
      { name: 'b', vertices: [coordinates[0], coordinates[2]] },
      { name: 'c', vertices: [coordinates[0], coordinates[1]] },
    ]

    for (const { name, vertices } of sideLabels) {
      const midpoint = [
        (vertices[0][0] + vertices[1][0]) / 2,
        (vertices[0][1] + vertices[1][1]) / 2,
      ]
      const direction = [midpoint[0] - centroid[0], midpoint[1] - centroid[1]]
      const magnitude = Math.hypot(...direction) || 1
      const distance = Math.max(width, height) * 0.08
      const labelPosition = [
        midpoint[0] + direction[0] / magnitude * distance,
        midpoint[1] + direction[1] / magnitude * distance,
      ]

      board.create('text', [...labelPosition, name], {
        fixed: true,
        anchorX: 'middle',
        anchorY: 'middle',
        fontSize: 17,
        highlight: false,
        cssStyle: 'font-weight: 700;',
      })
    }
  }

  onMounted(() => draw(triangleReference.value))
  watch(triangleReference, (triangle) => draw(triangle))

  onBeforeUnmount(() => {
    if (board) JXG.JSXGraph.freeBoard(board)
  })
}
