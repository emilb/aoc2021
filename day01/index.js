const fs = require('fs')

function inputDataLinesIntegers (filename = 'input.txt') {
  return fs.readFileSync(filename).toString().trim().split('\n').map((x) => parseInt(x))
}

function getSolutionPart1 () {
  let noofIncreases = 0
  const depths = inputDataLinesIntegers()
  let lastValue = inputDataLinesIntegers[0]
  for (let i = 0; i < depths.length; i++) {
    if (depths[i] > lastValue) { noofIncreases++ }
    lastValue = depths[i]
  }

  return noofIncreases
}

function getSolutionPart2 () {
  const windowSize = 3

  let noofIncreases = 0
  const depths = inputDataLinesIntegers()

  let A = 0
  let B = 0

  for (let i = 0; i < depths.length; i++) {
    A = getWindowSum(depths, i, windowSize)
    B = getWindowSum(depths, i + 1, windowSize)
    if (B > A) { noofIncreases++ }
  }

  return noofIncreases
}

function getWindowSum (depths, startIndex, windowSize) {
  let sum = 0
  for (let i = 0; i < windowSize; i++) {
    sum += getNextDepth(depths, startIndex + i)
  }
  return sum
}

function getNextDepth (depths, index) {
  if (index >= depths.length) { return 0 }

  return depths[index]
}

const part = process.env.part || 'part1'

if (part === 'part1') { console.log(getSolutionPart1()) } else { console.log(getSolutionPart2()) }

module.exports = {
  getSolutionPart1, getSolutionPart2, inputDataLinesIntegers
}
