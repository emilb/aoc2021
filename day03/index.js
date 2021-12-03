const fs = require('fs')

function inputDataLinesIntegers (filename = 'input.txt') {
  return fs.readFileSync(filename).toString().trim().split('\n').map((x) => x) // parseInt(x).toString(2))
}

function getSolutionPart1 () {
  const data = inputDataLinesIntegers()
  const noofBits = data[0].length

  let binaryResultGamma = ''
  let binaryResultEpsilon = ''
  for (let ib = 0; ib < noofBits; ib++) {
    if (countOnes(data, ib) > data.length / 2) {
      binaryResultGamma += '1'
      binaryResultEpsilon += '0'
    } else {
      binaryResultGamma += '0'
      binaryResultEpsilon += '1'
    }
  }

  const digitGama = parseInt(binaryResultGamma, 2)
  const digitEpsilon = parseInt(binaryResultEpsilon, 2)

  return digitGama * digitEpsilon
}

function countOnes (dataArray, pos) {
  let ones = 0

  dataArray.forEach(element => {
    if (element[pos] === '1') { ones++ }
  })

  return ones
}

function getSolutionPart2 () {
  const data = inputDataLinesIntegers()
  const o2 = filter(data, 0, (ones, len) => { return ones >= len / 2 ? '1' : '0' })
  const co2 = filter(data, 0, (ones, len) => { return ones < len / 2 ? '1' : '0' })

  return o2 * co2
}

function filter (data, pos, strategy) {
  if (data.length === 1) {
    return parseInt(data[0], 2)
  }

  const ones = countOnes(data, pos)
  const wanted = strategy(ones, data.length)

  return filter(data.filter((val) => val[pos] === wanted), pos + 1, strategy)
}

const part = process.env.part || 'part1'

if (part === 'part1') { console.log(getSolutionPart1()) } else { console.log(getSolutionPart2()) }
