const fs = require('fs')

function inputDataLinesIntegers (filename = 'input-test.txt') {
  return fs.readFileSync(filename).toString().trim().split('\n').map((x) => parseInt(x))
}

function extrapolateX (v) {
  const xPositions = [0]

  let sum = 0
  for (let x = v; x > 0; x--) {
    xPositions.push(x + sum)
    sum += x
  }
  return xPositions
}

function extrapolateY (v, minY) {
  const yPositions = [0]

  let currY = 0
  let vy = v
  let sum = 0
  while (currY > minY) {
    currY = vy + sum
    yPositions.push(currY)
    sum += vy
    vy--
  }

  return yPositions
}

function getClosestValueEquealOrAbove (values, val) {
  let step = 0
  for (const currVal of values) {
    if (currVal === val || currVal > val) {
      return { step: step, value: currVal }
    }
    step++
  }
  return -1
}

function getClosestValueEquealOrBelow (values, val) {
  let step = 0
  for (const currVal of values) {
    if (currVal === val || currVal < val) {
      return { step: step, value: currVal }
    }
    step++
  }
  return -1
}

function calculatePossibleXVelocities (targetXMin, targetXMax) {
  const velocities = []
  for (let v = 0; v <= targetXMax; v++) {
    const closest = getClosestValueEquealOrAbove(extrapolateX(v), targetXMin)

    if (closest.value >= targetXMin && closest.value <= targetXMax) {
      velocities.push({
        velocity: v,
        step: closest.step,
        value: closest.value
      })
    }
  }
  return velocities
}

function calculatePossibleYVelocities (targetYMin, targetYMax) {
  const velocities = []
  for (let v = targetYMin; v <= Math.abs(targetYMin); v++) {
    const closest = getClosestValueEquealOrBelow(extrapolateY(v, targetYMin), targetYMax)

    if (closest.value >= targetYMin && closest.value <= targetYMax) {
      velocities.push({
        velocity: v,
        step: closest.step,
        value: closest.value
      })
    }
  }
  return velocities
}

function isAMatch (xv, yv, minX, maxX, minY, maxY) {
  const maxNoofSteps = Math.max(xv.step, yv.step)
  let currX = 0
  let currY = 0
  let currVX = xv.velocity
  let currVY = yv.velocity
  for (let step = 0; step < maxNoofSteps; step++) {
    currX += currVX
    currY += currVY

    currVX--
    if (currVX < 0) currVX = 0
    currVY--
  }
  return currX >= minX && currX <= maxX && currY >= minY && currY <= maxY
}

function getHighestYVelocity (possibleXV, possibleYV, minX, maxX, minY, maxY) {
  for (let yvIx = possibleYV.length - 1; yvIx >= 0; yvIx--) {
    const yv = possibleYV[yvIx]

    for (let xvIx = 0; xvIx < possibleXV.length; xvIx++) {
      const xv = possibleXV[xvIx]
      if (isAMatch(xv, yv, minX, maxX, minY, maxY)) { return yv }
    }
  }
}

function getHighestY (v) {
  if (v < 0) { return 0 }

  let highest = 0
  while (highest + v > highest) {
    highest = highest + v
    v--
  }
  return highest
}

function countPossibleVelocities (possibleXV, possibleYV, minX, maxX, minY, maxY) {
  let matches = 0
  for (let yvIx = possibleYV.length - 1; yvIx >= 0; yvIx--) {
    const yv = possibleYV[yvIx]

    for (let xvIx = 0; xvIx < possibleXV.length; xvIx++) {
      const xv = possibleXV[xvIx]
      if (isAMatch(xv, yv, minX, maxX, minY, maxY)) { matches++ }
    }
  }
  return matches
}

function getSolutionPart1 () {
  // target area: x=20..30, y=-10..-5
  // target area: x=277..318, y=-92..-53

  const possibleXV = calculatePossibleXVelocities(277, 318)
  const possibleYV = calculatePossibleYVelocities(-92, -53)

  console.log(possibleXV)
  console.log(possibleYV)

  const highestYV = getHighestYVelocity(possibleXV, possibleYV, 277, 318, -92, -53)
  console.log(highestYV)
  return getHighestY(highestYV.velocity)
}

function getSolutionPart2 () {
  // target area: x=20..30, y=-10..-5
  // target area: x=277..318, y=-92..-53

  const possibleXV = calculatePossibleXVelocities(277, 318)
  const possibleYV = calculatePossibleYVelocities(-92, -53)

  // console.log(possibleXV)
  // console.log(possibleYV)

  return countPossibleVelocities(possibleXV, possibleYV, 277, 318, -92, -53)
}

const part = process.env.part || 'part1'

if (part === 'part1') { console.log(getSolutionPart1()) } else { console.log(getSolutionPart2()) }

module.exports = {
  getSolutionPart1, getSolutionPart2, inputDataLinesIntegers
}
