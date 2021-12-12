const fs = require('fs')

function inputDataLines (filename = 'input.txt') {
  return fs.readFileSync(filename).toString().trim().split('\n')
}

function getOpener (closer) {
  switch (closer) {
    case ')':
      return '('
    case ']':
      return '['
    case '}':
      return '{'
    case '>':
      return '<'
    default:
      return 'invalid'
  }
}

function getCloser (opener) {
  switch (opener) {
    case '(':
      return ')'
    case '[':
      return ']'
    case '{':
      return '}'
    case '<':
      return '>'
    default:
      return 'invalid'
  }
}

function getFirstUnclosed (linepart) {
  // () => 0
  // [] => 1
  // {} => 2
  // <> => 3
  const counter = [0, 0, 0, 0]
  for (const c of linepart.split('').reverse()) {
    switch (c) {
      case '(':
        counter[0]++
        break
      case ')':
        counter[0]--
        break

      case '[':
        counter[1]++
        break
      case ']':
        counter[1]--
        break

      case '{':
        counter[2]++
        break
      case '}':
        counter[2]--
        break

      case '<':
        counter[3]++
        break
      case '>':
        counter[3]--
        break
      default:
        break
    }

    if (counter[0] > 0) { return ')' } else if (counter[1] > 0) { return ']' } else if (counter[2] > 0) { return '}' } else if (counter[3] > 0) { return '>' }
  }
}

function getValidOptions (linepart) {
  const alwaysAvailable = ['(', '[', '{', '<']
  const lastUnclosed = getFirstUnclosed(linepart)
  return [...alwaysAvailable, lastUnclosed]
}

function parseLine (line) {
  for (let ix = 1; ix < line.length; ix++) {
    const nextAvailable = getValidOptions(line.slice(0, ix))
    if (!nextAvailable.includes(line.charAt(ix))) {
      return {
        line: line,
        pos: ix,
        expected: nextAvailable,
        char: line.charAt(ix)
      }
    }
  }
  return { line: line, pos: -1 }
}

function getSolutionPart1 () {
  const parseResult = inputDataLines().map((line) => parseLine(line))
  const result = parseResult.reduce((collect, line) => {
    let factor = 0
    if (line.char === ')') { factor = 3 }
    if (line.char === ']') { factor = 57 }
    if (line.char === '}') { factor = 1197 }
    if (line.char === '>') { factor = 25137 }
    if (line.pos > 0) {
      collect += factor
    }
    return collect
  }, 0)
  return result
}

function getWhatIsNeededToMakeLineComplete (line) {
  // console.log(line)
  let next = getFirstUnclosed(line)
  let result = ''
  while (next) {
    result += next
    next = getFirstUnclosed(line + result)
  }
  // console.log(result)
  return result
}

function getSolutionPart2 () {
  const parseResult = inputDataLines().map((line) => parseLine(line))
  // console.log(parseResult)
  const incompleteLines = parseResult.filter((parsed) => parsed.pos === -1)
  const completionStrings = incompleteLines.map((parsed) => getWhatIsNeededToMakeLineComplete(parsed.line))
  const completionValues = completionStrings.map((completion) => {
    let score = 0

    for (const c of completion) {
      score = score * 5
      let factor = 0
      if (c === ')') { factor = 1 }
      if (c === ']') { factor = 2 }
      if (c === '}') { factor = 3 }
      if (c === '>') { factor = 4 }
      score += factor
    }
    return score
  })

  // console.log(completionValues.sort())
  return completionValues.sort((a, b) => a - b)[Math.floor(completionValues.length / 2)]
}

const part = process.env.part || 'part1'

if (part === 'part1') { console.log(getSolutionPart1()) } else { console.log(getSolutionPart2()) }

module.exports = {
  getSolutionPart1, getSolutionPart2
}
