const fs = require('fs')

function inputDataLinesIntegers (filename = 'input.txt') {
  return fs.readFileSync(filename).toString().trim().split(',').map((x) => parseInt(x))
}

function getAveragePosition (positions) {
  return Math.round(positions.reduce((a, b) => a + b, 0) / positions.length)
}

function getMedianPosition (positions) {
  positions.sort(function (a, b) {
    return a - b
  })

  const half = Math.floor(positions.length / 2)

  if (positions.length % 2) { return positions[half] }

  return (positions[half - 1] + positions[half]) / 2.0
}

function calculateMovementsTo (positions, pos) {
  return positions.reduce((a, b) => a + Math.abs(pos - b), 0)
}

function getSolutionPart1 () {
  const positions = inputDataLinesIntegers()

  return calculateMovementsTo(positions, getMedianPosition(positions))
}

function calculateSumOfSeries (max) {
  return max * (max + 1) / 2
}

function calculateNewMovementsTo (positions, pos) {
  return positions.reduce((a, b) => a + calculateSumOfSeries(Math.abs(pos - b)), 0)
}

function getSolutionPart2 () {
  const positions = inputDataLinesIntegers()

  // Get i reasonable starting point
  const average = getAveragePosition(positions)
  let ix = 0
  let lowest = calculateNewMovementsTo(positions, Math.max(...positions))

  // Iterate up and down from the average point and look for the
  // lowest cost.
  while (ix < positions.length / 2 && average - ix >= 0) {
    const costDown = calculateNewMovementsTo(positions, average - ix)
    const costUp = calculateNewMovementsTo(positions, average + ix)
    lowest = Math.min(lowest, costUp, costDown)
    ix++
  }

  return lowest
}

const part = process.env.part || 'part1'

if (part === 'part1') { console.log(getSolutionPart1()) } else { console.log(getSolutionPart2()) }

module.exports = {
  getSolutionPart1, getSolutionPart2, inputDataLinesIntegers
}
