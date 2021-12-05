const fs = require('fs')

const map = []
let width = 0
const lines = []

function parseAndAddLine (line) {
  // Line looks like this: 1,1 -> 1,3
  const coord = line.split(' -> ')
  const valsFrom = coord[0].split(',').map((x) => parseInt(x))
  const valsTo = coord[1].split(',').map((x) => parseInt(x))

  lines.push({
    fromX: valsFrom[0],
    fromY: valsFrom[1],
    toX: valsTo[0],
    toY: valsTo[1]
  })
  const max = Math.max(...valsTo, ...valsFrom)
  if (width < max) { width = max }
}

function addPointToMap (x, y) {
  // console.log('adding ' + x + ',' + y)
  const pos = coordinateToPosition(x, y, width)
  if (!map[pos]) { map[pos] = 1 } else { map[pos] = map[pos] + 1 }
}

function createMapPart1 () {
  lines.forEach(line => {
    if (line.fromX === line.toX) {
      for (let y = Math.min(line.fromY, line.toY); y <= Math.max(line.fromY, line.toY); y++) {
        addPointToMap(line.fromX, y)
      }
    }

    if (line.fromY === line.toY) {
      for (let x = Math.min(line.fromX, line.toX); x <= Math.max(line.fromX, line.toX); x++) {
        addPointToMap(x, line.fromY)
      }
    }
  })
}

function createMapPart2 () {
  lines.forEach(line => {
    // console.log(line)
    if (line.fromX === line.toX) {
      for (let y = Math.min(line.fromY, line.toY); y <= Math.max(line.fromY, line.toY); y++) {
        addPointToMap(line.fromX, y)
      }
    } else if (line.fromY === line.toY) {
      for (let x = Math.min(line.fromX, line.toX); x <= Math.max(line.fromX, line.toX); x++) {
        addPointToMap(x, line.fromY)
      }
    } else {
      const maxX = Math.max(line.fromX, line.toX)
      const minX = Math.min(line.fromX, line.toX)

      for (let step = 0; step <= maxX - minX; step++) {
        let added = false
        // + +
        if (line.fromX < line.toX && line.fromY < line.toY) {
          // console.log('+ +')
          addPointToMap(line.fromX + step, line.fromY + step)
          added = true
        }

        // - -
        if (line.fromX > line.toX && line.fromY > line.toY) {
          // console.log('- -')
          addPointToMap(line.fromX - step, line.fromY - step)
          added = true
        }

        // + -
        if (line.fromX < line.toX && line.fromY > line.toY) {
          // console.log('+ -')
          addPointToMap(line.fromX + step, line.fromY - step)
          added = true
        }

        // - +
        if (line.fromX > line.toX && line.fromY < line.toY) {
          // console.log('- +')
          addPointToMap(line.fromX - step, line.fromY + step)
          added = true
        }

        if (!added) {
          console.log('no point added for line ')
          console.log(line)
        }
      }
    }
  })
}

function coordinateToPosition (x, y, width) {
  return x + y * width
}

function positionToCoordinate (pos, width) {
  const y = Math.floor(pos / width)
  const x = pos - y * width
  return {
    x: x,
    y: y
  }
}

function printMap () {
  for (let ix = 0; ix < width * width; ix++) {
    if (ix % width === 0) { process.stdout.write('\n') }
    process.stdout.write((map[ix] || '.') + '')
  }
}

function inputDataLinesIntegers (filename = 'input.txt') {
  fs.readFileSync(filename).toString().trim().split('\n').map((line) => parseAndAddLine(line))
  width++
}

function getSolutionPart1 (filename = 'input.txt') {
  console.log(filename)
  map.length = 0
  lines.length = 0
  width = 0
  inputDataLinesIntegers(filename)
  createMapPart1()
  // printMap()
  return map.reduce((prev, curr) => prev + (curr >= 2 ? 1 : 0), 0)
}

function getSolutionPart2 (filename = 'input.txt') {
  map.length = 0
  lines.length = 0
  width = 0
  inputDataLinesIntegers(filename)
  createMapPart2()
  // printMap()
  return map.reduce((prev, curr) => prev + (curr >= 2 ? 1 : 0), 0)
}

const part = process.env.part || 'part1'

if (part === 'part1') { console.log(getSolutionPart1()) } else { console.log(getSolutionPart2()) }

module.exports = {
  getSolutionPart1, getSolutionPart2, inputDataLinesIntegers, coordinateToPosition, positionToCoordinate
}
