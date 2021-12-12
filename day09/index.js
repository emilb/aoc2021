const fs = require('fs')

function inputDataLinesIntegers (filename = 'input.txt') {
  return fs.readFileSync(filename).toString().trim().split('\n').map((x) => x.split('').map((n) => parseInt(n)))
}

function getPointValue (heightmap, x, y) {
  const width = heightmap[0].length
  const height = heightmap.length

  if (x < 0 || x >= width) { return -1 }

  if (y < 0 || y >= height) { return -1 }

  return heightmap[y][x]
}

function getAdjacent (heightmap, x, y) {
  return [
    getPointValue(heightmap, x - 1, y),
    getPointValue(heightmap, x + 1, y),
    getPointValue(heightmap, x, y - 1),
    getPointValue(heightmap, x, y + 1)
  ].filter((val) => val >= 0)
}

function isALowPoint (pointValue, adjacent) {
  return adjacent.filter((n) => pointValue >= n).length === 0
}

function getLowPoints (heightmap) {
  const width = heightmap[0].length
  const height = heightmap.length

  const lowPoints = []
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const pointValue = getPointValue(heightmap, x, y)
      const adjacent = getAdjacent(heightmap, x, y)

      if (isALowPoint(pointValue, adjacent)) {
        lowPoints.push(pointValue)
      }
    }
  }
  return lowPoints
}

function getSolutionPart1 () {
  return getLowPoints(inputDataLinesIntegers()).reduce((acc, curr) => acc + curr + 1, 0)
}

function getPointValueInBasin (heightmap, x, y) {
  const pointValue = getPointValue(heightmap, x, y)

  return pointValue === 9 ? -1 : pointValue
}

function getAdjacentHigherValues (heightmap, x, y) {
  const higherPoints = []
  const pointValue = getPointValue(heightmap, x, y)

  if (getPointValueInBasin(heightmap, x - 1, y) > pointValue) { higherPoints.push([x - 1, y]) }
  if (getPointValueInBasin(heightmap, x + 1, y) > pointValue) { higherPoints.push([x + 1, y]) }
  if (getPointValueInBasin(heightmap, x, y - 1) > pointValue) { higherPoints.push([x, y - 1]) }
  if (getPointValueInBasin(heightmap, x, y + 1) > pointValue) { higherPoints.push([x, y + 1]) }

  return higherPoints
}

function removeDuplicates (coordinateList) {
  const unique = new Set()
  const result = []
  coordinateList.forEach((c) => {
    const sval = c[0] + '.' + c[1]
    if (!unique.has(sval)) {
      unique.add(sval)
      result.push(c)
    }
  })
  return result
}

function getBasin (heightmap, higherCoordinates, coordinates) {
  if (coordinates.length === 0) { return removeDuplicates(higherCoordinates) }

  // console.log('coordinates:')
  // console.log(coordinates)

  const newCoordinates = []
  for (let ix = 0; ix < coordinates.length; ix++) {
    const coord = coordinates[ix]
    const adjHigher = getAdjacentHigherValues(heightmap, coord[0], coord[1])

    // console.log('adjHigher:')
    // console.log(adjHigher)

    newCoordinates.push(...adjHigher)
    higherCoordinates.push(coord)
    // heightmap[coord[0]][coord[1]] = 9
  }
  // console.log('newCoordinates: ')
  // console.log(newCoordinates)
  return getBasin(heightmap, higherCoordinates, [...newCoordinates])
}

function getLowCoordinates (heightmap) {
  const width = heightmap[0].length
  const height = heightmap.length

  const lowPoints = []
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const pointValue = getPointValue(heightmap, x, y)
      const adjacent = getAdjacent(heightmap, x, y)

      if (isALowPoint(pointValue, adjacent)) {
        lowPoints.push([x, y])
      }
    }
  }
  return lowPoints
}

function getSolutionPart2 () {
  const heightMap = inputDataLinesIntegers()
  const lowCoordinates = getLowCoordinates(heightMap)
  const basinSizes = lowCoordinates.map((c) => getBasin(heightMap, [], [c]).length)
  basinSizes.sort((a, b) => b - a)
  console.log(basinSizes.slice(0, 3))
  return basinSizes.slice(0, 3).reduce((acc, curr) => acc * curr)
//  console.log(lowCoordinates.map((c) => getBasin(heightMap, [], [c]).length))
//  return getBasin(heightMap, [], [[2, 2]]).length
}

const part = process.env.part || 'part1'

if (part === 'part1') { console.log(getSolutionPart1()) } else { console.log(getSolutionPart2()) }

module.exports = {
  getSolutionPart1, getSolutionPart2, inputDataLinesIntegers
}
