const fs = require('fs')

function inputDataLines (filename = 'input.txt') {
  return fs.readFileSync(filename).toString().trim().split('\n')
}

function addPath (pathMap, from, to) {
  if (pathMap.has(from)) {
    pathMap.get(from).push(to)
  } else {
    pathMap.set(from, [to])
  }
}

function getPathMap (input) {
  const pathMap = new Map()
  input.forEach((line) => {
    const fromTo = line.split('-')
    addPath(pathMap, fromTo[0], fromTo[1])
    addPath(pathMap, fromTo[1], fromTo[0])
  })
  return pathMap
}

function isSmallCave (cave) {
  return cave.toLowerCase() === cave
}

function hasSmallCaveTwice (path) {
  const pathCopy = [...path].filter(isSmallCave).sort()
  let prev = pathCopy[0]
  for (let ix = 1; ix < pathCopy.length; ix++) {
    if (prev === pathCopy[ix]) { return true }
    prev = pathCopy[ix]
  }
  return false
}

function getValidNextPaths (pathMap, paths) {
  const newPaths = []
  paths.forEach((path) => {
    const cave = path.slice(-1)[0]

    pathMap.get(cave).forEach((nextCave) => {
      const isSmall = isSmallCave(nextCave)
      if (!isSmall) {
        newPaths.push([...path, nextCave])
      } else {
        if (!path.includes(nextCave)) { newPaths.push([...path, nextCave]) }
      }
    })
  })

  return newPaths
}

function getValidNextPathsDoubleVisit (pathMap, paths) {
  const newPaths = []
  paths.forEach((path) => {
    const cave = path.slice(-1)[0]

    pathMap.get(cave).filter((c) => c !== 'start').forEach((nextCave) => {
      const isSmall = isSmallCave(nextCave)
      if (!isSmall) {
        newPaths.push([...path, nextCave])
      } else {
        if (!path.includes(nextCave)) {
          newPaths.push([...path, nextCave])
        } else if (!hasSmallCaveTwice(path)) {
          newPaths.push([...path, nextCave])
        }
      }
    })
  })

  return newPaths
}

function getEndedPaths (paths) {
  return paths.filter((path) => path.slice(-1)[0] === 'end')
}

function getActivePaths (paths) {
  return paths.filter((path) => path.slice(-1)[0] !== 'end')
}

function getAllPaths (pathMap, endedPaths, activePaths) {
  if (activePaths.length === 0) { return endedPaths }

  const validPaths = getValidNextPaths(pathMap, activePaths)
  const ended = getEndedPaths(validPaths)
  const active = getActivePaths(validPaths)

  return getAllPaths(pathMap, [...endedPaths, ...ended], active)
}

function getAllPathsDoubleVisit (pathMap, endedPaths, activePaths) {
  if (activePaths.length === 0) { return endedPaths }

  const validPaths = getValidNextPathsDoubleVisit(pathMap, activePaths)
  const ended = getEndedPaths(validPaths)
  const active = getActivePaths(validPaths)

  return getAllPathsDoubleVisit(pathMap, [...endedPaths, ...ended], active)
}

function getSolutionPart1 () {
  const pathMap = getPathMap(inputDataLines())

  return getAllPaths(pathMap, [], [['start']]).length
}

function getSolutionPart2 () {
  const pathMap = getPathMap(inputDataLines())

  return getAllPathsDoubleVisit(pathMap, [], [['start']]).length
}

const part = process.env.part || 'part1'

if (part === 'part1') { console.log(getSolutionPart1()) } else { console.log(getSolutionPart2()) }

module.exports = {
  getSolutionPart1, getSolutionPart2, inputDataLinesIntegers: inputDataLines
}
