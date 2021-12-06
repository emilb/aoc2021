const fs = require('fs')

let schoolLinear = []
let day = 0

let school = new Map()

function inputDataLinesIntegers (filename = 'input.txt') {
  return fs.readFileSync(filename).toString().trim().split(',').map((x) => parseInt(x))
}

function simulateDayLinear () {
  const nextSchool = []
  schoolLinear.forEach((fish, index) => {
    fish--

    // reset fish and spawn new
    if (fish === -1) {
      fish = 6
      nextSchool.push(8)
    }

    schoolLinear[index] = fish
  })

  schoolLinear.push(...nextSchool)
  day++
}

function getSolutionPart1 () {
  schoolLinear = inputDataLinesIntegers()

  while (day < 80) {
    simulateDayLinear()
  }

  return schoolLinear.length
}

function prepareInitialSchool (initialSchool) {
  initialSchool.forEach(fish => {
    school.set(fish, (school.get(fish) || 0) + 1)
  })
}
function simulateDay () {
  const nextSchool = new Map()

  for (const fishAge of school.keys()) {
    const fish = school.get(fishAge)
    if (fishAge === 0) {
      nextSchool.set(8, fish)
      nextSchool.set(6, (nextSchool.get(6) || 0) + fish)
    } else {
      const newFishAge = fishAge - 1
      nextSchool.set(newFishAge, (nextSchool.get(newFishAge) || 0) + fish)
    }
  }

  school = nextSchool
  day++
}

function getSolutionPart2 () {
  const initialSchool = inputDataLinesIntegers()
  prepareInitialSchool(initialSchool)

  while (day < 256) {
    simulateDay()
  }

  let sum = 0
  for (const fish of school.values()) {
    sum += fish
  }

  return sum
}

function printMapSorted (fishmap) {
  console.log(new Map([...fishmap.entries()].sort()))
}

const part = process.env.part || 'part1'

if (part === 'part1') { console.log(getSolutionPart1()) } else { console.log(getSolutionPart2()) }

module.exports = {
  getSolutionPart1, getSolutionPart2, inputDataLinesIntegers
}
