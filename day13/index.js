const fs = require('fs')

function inputDataLines (filename = 'input.txt') {
  return fs.readFileSync(filename).toString().trim().split('\n').map((x) => x)
}

function parseCoordinates (lines) {
  return lines.map((l) => {
    const c = l.split(',')
    return {
      x: parseInt(c[0]),
      y: parseInt(c[1])
    }
  })
}

function parseFold (lines) {
  return lines.map((l) => {
    const c = l.split(' ')
    const fold = c[2].split('=')
    return {
      axis: fold[0],
      pos: parseInt(fold[1])
    }
  })
}

function getWidth (coordinates) {
  let maxWidth = 0
  coordinates.forEach(c => {
    maxWidth = c.x > maxWidth ? c.x : maxWidth
  })
  return maxWidth
}

function getHeight (coordinates) {
  let maxHeight = 0
  coordinates.forEach(c => {
    maxHeight = c.y > maxHeight ? c.y : maxHeight
  })
  return maxHeight
}

function fold (coordinates, fold, width, height) {
  const newCoordinates = [...coordinates]

  if (fold.axis === 'y') {
    coordinates.forEach((c, ix) => {
      if (c.y > fold.pos) {
        newCoordinates[ix].y = Math.abs(c.y - height)
      }
    })
  } else if (fold.axis === 'x') {
    coordinates.forEach((c, ix) => {
      if (c.x > fold.pos) {
        newCoordinates[ix].x = Math.abs(c.x - width)
      }
    })
  }

  return newCoordinates
}

function countVisible (coordinates) {
  const cSet = new Set()
  coordinates.forEach(elm => {
    cSet.add(elm.x + '-' + elm.y)
  })
  return cSet.size
}

function getSolutionPart1 () {
  const coordinates = parseCoordinates(inputDataLines())
  const foldInstruction = parseFold(inputDataLines('input-fold.txt'))
  const width = getWidth(coordinates)
  const height = getHeight(coordinates)

  return countVisible(fold(coordinates, foldInstruction[0], width, height))
}

function getSolutionPart2 () {
  let coordinates = parseCoordinates(inputDataLines())
  const foldInstruction = parseFold(inputDataLines('input-fold.txt'))
  let width = getWidth(coordinates)
  let height = getHeight(coordinates)

  foldInstruction.forEach(f => {
    coordinates = fold(coordinates, f, width, height)
    width = getWidth(coordinates)
    height = getHeight(coordinates)
  })
  printCoordinates(coordinates)
  return 0
}

function printCoordinates (coordinates) {
  const width = getWidth(coordinates)
  const height = getHeight(coordinates)

  const arr = []
  for (let i = 0; i <= height; i++) { arr.push(new Array(width + 1)) }

  coordinates.forEach(c => {
    arr[c.y][c.x] = 'x'
  })

  for (let y = 0; y < arr.length; y++) {
    let line = ''
    for (let x = 0; x < width + 1; x++) {
      line += arr[y][x] === 'x' ? 'x' : ' '
    }
    console.log(line)
  }
}
const part = process.env.part || 'part1'

if (part === 'part1') { console.log(getSolutionPart1()) } else { console.log(getSolutionPart2()) }

module.exports = {
  getSolutionPart1, getSolutionPart2
}
