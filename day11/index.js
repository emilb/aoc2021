const fs = require('fs')

let width = 0
let height = 0

function inputDataLinesIntegersInArow (filename = 'input.txt') {
  const rows = fs.readFileSync(filename).toString().trim().split('\n').map((x) => x.split('').map((n) => parseInt(n)))
  height = rows.length
  width = rows[0].length

  const result = []
  for (const row of rows) {
    result.push(...row)
  }
  return result
}

function safeCoordinateToPosition (x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) { return -1 } else return coordinateToPosition(x, y)
}

function coordinateToPosition (x, y) {
  return x + y * width
}

function positionToCoordinate (pos) {
  const y = Math.floor(pos / width)
  const x = pos - y * width
  return {
    x: x,
    y: y
  }
}

function getSurrounding (pos) {
  const xy = positionToCoordinate(pos)
  // console.log(xy)
  return [
    safeCoordinateToPosition(xy.x - 1, xy.y),
    safeCoordinateToPosition(xy.x + 1, xy.y),
    safeCoordinateToPosition(xy.x, xy.y - 1),
    safeCoordinateToPosition(xy.x, xy.y + 1),
    safeCoordinateToPosition(xy.x - 1, xy.y + 1),
    safeCoordinateToPosition(xy.x + 1, xy.y - 1),
    safeCoordinateToPosition(xy.x - 1, xy.y - 1),
    safeCoordinateToPosition(xy.x + 1, xy.y + 1)
  ].filter((position) => position >= 0)
}

function analyzeFlashes (grid) {
  let changes = false
  const result = [...grid]
  for (let ix = 0; ix < result.length && changes === false; ix++) {
    if (result[ix] > 9) {
      changes = true
      const changedPositions = getSurrounding(ix)
      changedPositions.forEach(pos => {
        if (result[pos] !== 0) { result[pos] = result[pos] + 1 }
      })
      result[ix] = 0
    }
  }

  return {
    grid: result,
    changed: changes
  }
}

function bumpAll (grid) {
  return grid.map((val) => val + 1)
}

function getSolutionPart1 () {
  const startGrid = inputDataLinesIntegersInArow()

  let currentGrid = [...startGrid]
  printGrid(currentGrid)
  let flashes = 0
  for (let i = 0; i < 100; i++) {
    currentGrid = bumpAll(currentGrid)
    let change = true
    while (change) {
      const analyzed = analyzeFlashes(currentGrid)
      change = analyzed.changed
      currentGrid = analyzed.grid
      if (change) { flashes++ }
    }
  }

  return flashes
}

function isCurrentGridZero (grid) {
  return grid.reduce((acc, val) => val + acc, 0)
}

function getSolutionPart2 () {
  const startGrid = inputDataLinesIntegersInArow()

  let currentGrid = [...startGrid]
  let ix = 0
  for (ix = 0; ix < 1000; ix++) {
    currentGrid = bumpAll(currentGrid)
    let change = true
    while (change) {
      const analyzed = analyzeFlashes(currentGrid)
      change = analyzed.changed
      currentGrid = analyzed.grid
    }
    if (isCurrentGridZero(currentGrid) === 0) { return ix + 1 }
  }

  return 'unvalid'
}

function printGrid (grid) {
  grid.forEach((val, ix) => {
    if (ix % width === 0) { process.stdout.write('\n') }
    process.stdout.write(val + ' ')
  })
  process.stdout.write('\n\n')
}

const part = process.env.part || 'part1'

if (part === 'part1') { console.log(getSolutionPart1()) } else { console.log(getSolutionPart2()) }

module.exports = {
  getSolutionPart1, getSolutionPart2

}
