const fs = require('fs')

function inputDataLines (filename = 'input.txt') {
  return fs.readFileSync(filename).toString().trim().split('\n').map((x) => x)
}

function parseData (inputlines) {
  const template = inputlines[0]
  const insertionRules = new Map()

  for (const rule of inputlines.slice(2)) {
    const pair = rule.split(' -> ')[0]
    const insertion = rule.split(' -> ')[1]
    insertionRules.set(pair, insertion)
  }
  return {
    template: template,
    rules: insertionRules
  }
}

function processPolymer (polymer, rules) {
  let nextPolymer = ''

  // console.log(polymer)
  for (let i = 0; i < polymer.length - 1; i++) {
    const pair = polymer[i] + polymer[i + 1]
    // console.log(pair)

    if (rules.has(pair)) {
      nextPolymer += pair[0] + rules.get(pair) // + pair[1]
      // console.log(nextPolymer)
    }
  }
  nextPolymer += polymer[polymer.length - 1]
  return nextPolymer
}

function sortCharacters (value) {
  return value.split('').sort((a, b) => a.localeCompare(b)).join('')
}

function getFrequency (polymer) {
  const sortedPolymer = sortCharacters(polymer)
  const result = {}
  let curr = sortedPolymer[0]
  let currCounter = 0
  for (let i = 0; i < sortedPolymer.length; i++) {
    if (curr === sortedPolymer[i]) {
      currCounter++
    } else {
      result[curr] = currCounter
      curr = sortedPolymer[i]
      currCounter = 1
    }
  }

  result[curr] = currCounter
  return result
}

function calculateDifference (frequency) {
  let max = 0
  let min = Number.MAX_SAFE_INTEGER

  for (const prop in frequency) {
    max = Math.max(max, frequency[prop])
    min = Math.min(min, frequency[prop])
  }
  return max - min
}

function getSolutionPart1 () {
  const input = parseData(inputDataLines())
  let polymer = input.template
  for (let i = 0; i < 10; i++) {
    polymer = processPolymer(polymer, input.rules)
  }

  const frequency = getFrequency(polymer)
  return calculateDifference(frequency)
}

function getSolutionPart2 () {
  const input = parseData(inputDataLines())

  const polymer = input.template
  const rules = input.rules
  let pairs = {}

  // Initial Pairs
  for (let i = 1; i < polymer.length; i++) {
    const pair = polymer[i - 1] + polymer[i]

    if (!(pair in pairs)) pairs[pair] = 0
    pairs[pair] += 1
  }

  // Mutate pairs
  for (let step = 0; step < 40; step++) {
    const newPairs = {}

    for (const [pair, cnt] of Object.entries(pairs)) {
      // Each pair that has an existing rule will split into 2 new pairs
      const pair1 = pair[0] + rules.get(pair)
      const pair2 = rules.get(pair) + pair[1]

      if (!(pair1 in newPairs)) newPairs[pair1] = 0
      if (!(pair2 in newPairs)) newPairs[pair2] = 0

      newPairs[pair1] += cnt
      newPairs[pair2] += cnt
    }

    pairs = { ...newPairs }
  }

  const charCounts = {}

  for (const [pair, cnt] of Object.entries(pairs)) {
    if (!(pair[0] in charCounts)) charCounts[pair[0]] = 0
    if (!(pair[1] in charCounts)) charCounts[pair[1]] = 0

    charCounts[pair[0]] += cnt
    charCounts[pair[1]] += cnt
  }

  let leastCommon = Infinity
  let mostCommon = 0

  Object.values(charCounts).forEach(count => {
    // Rounding error due to first and last character in polymer chain occurring only once
    const realCount = Math.ceil(count / 2)

    if (realCount < leastCommon) leastCommon = realCount
    if (realCount > mostCommon) mostCommon = realCount
  })

  return mostCommon - leastCommon
}

const part = process.env.part || 'part1'

if (part === 'part1') { console.log(getSolutionPart1()) } else { console.log(getSolutionPart2()) }

module.exports = {
  getSolutionPart1, getSolutionPart2
}
