const fs = require('fs')

function inputDataLinesIntegers (filename = 'input.txt') {
  return fs.readFileSync(filename).toString().trim().split('\n').map((x) => {
    const line = x.split(' ')
    return {
      direction: line[0],
      len: parseInt(line[1])
    }
  })
}

function getSolutionPart1 (data) {
  let forward = 0; let updown = 0

  for (let i = 0; i < data.length; i++) {
    switch (data[i].direction) {
      case 'forward' :
        forward += data[i].len
        break
      case 'up' :
        updown -= data[i].len
        break
      case 'down' :
        updown += data[i].len
        break
    }
  }

  return forward * updown
}

function getSolutionPart2 (data) {
  let forward = 0; let updown = 0; let aim = 0

  for (let i = 0; i < data.length; i++) {
    switch (data[i].direction) {
      case 'forward' :
        forward += data[i].len
        updown += aim * data[i].len
        break
      case 'up' :
        aim -= data[i].len
        break
      case 'down' :
        aim += data[i].len
        break
    }
  }

  return forward * updown
}

const part = process.env.part || 'part1'

const data = inputDataLinesIntegers()
if (part === 'part1') { console.log(getSolutionPart1(data)) } else { console.log(getSolutionPart2(data)) }

module.exports = {
  getSolutionPart1, getSolutionPart2, inputDataLinesIntegers
}
