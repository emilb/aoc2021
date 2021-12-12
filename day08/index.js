const fs = require('fs')

function inputDataLines (filename = 'input.txt') {
  return fs.readFileSync(filename).toString().trim().split('\n').map((x) => x)
}

/*
0 => 6
1 => 2 *
2 => 5
3 => 5
4 => 4 *
5 => 5
6 => 6
7 => 3 *
8 => 7 *
9 => 6

  0:     1*:      2:      3:     4*:
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

  5:      6:     7*:     8*:      9:
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg

 diff av 7 och 1 ger mappning för a
 om en 4 delar alla segment med en 6-längd är det 9
    annars om en 6-längd delar alla segment med en 1-längd är det 0
    annars är det 6
 om en 5 längd delar alla segment med en 1-längd är det en 3
    annars om en 5-längd delar alla segment med en 6:a är det en 5
    annars är det 2
*/
function getSolutionPart1 () {
  const lines = inputDataLines()

  let sum = 0
  for (const line of lines) {
    const outputvalues = line.split(' | ')[1].split(' ')
    sum += outputvalues.reduce((a, b) => a + (b.length === 2 || b.length === 3 || b.length === 4 || b.length === 7 ? 1 : 0), 0)
  }
  return sum
}

function getSimilarity (code1, code2) {
  const shortest = code1.length <= code2.length ? code1 : code2
  const longest = code1.length > code2.length ? code1 : code2

  console.log('shortest: ' + shortest)
  console.log('longest: ' + longest)

  let commonOccurences = 0
  const longestArr = longest.split('')

  for (const c of String(shortest)) {
    console.log('c: ' + c)
    if (longestArr.includes(c)) { commonOccurences++ }
  }
  console.log('common occ: ' + commonOccurences)
  return commonOccurences
}

function getMapping (entries) {
  const entryMap = new Map()

  // It seems we always have these
  const one = String(entries.filter(entry => entry.length === 2))
  const four = String(entries.filter(entry => entry.length === 4))
  const seven = String(entries.filter(entry => entry.length === 3))
  const eight = String(entries.filter(entry => entry.length === 7))

  let zero; let two; let three; let five; let six; let nine = ''
  console.log('1: ' + one)
  console.log('4: ' + four)
  console.log('7: ' + seven)
  console.log('8: ' + eight)
  /*
   om en 4 delar alla segment med en 6-längd är det 9
    annars om en 6-längd delar alla segment med en 1-längd är det 0
    annars är det 6
 om en 5 längd delar alla segment med en 1-längd är det en 3
    annars om en 5-längd delar alla segment med en 6:a är det en 5
    annars är det 2
    */
  console.log('entries: ' + entries)
  for (const entry of entries) {
    console.log('entry is: ' + entry)
    const len = entry.length
    if (len === 6) {
      if (getSimilarity(entry, four) === 4) { nine = entry } else if (getSimilarity(entry, one) === 2) { zero = entry } else six = entry
    }
    if (len === 5) {
      if (getSimilarity(entry, one) === 2) { three = entry } else if (getSimilarity(entry, six) === 5) {
        five = entry
      } else {
        two = entry
      }
    }
  }
  entryMap.set(one, 1)
  entryMap.set(two, 2)
  entryMap.set(three, 3)
  entryMap.set(four, 4)
  entryMap.set(five, 5)
  entryMap.set(six, 6)
  entryMap.set(seven, 7)
  entryMap.set(eight, 8)
  entryMap.set(nine, 9)
  entryMap.set(zero, 0)

  return entryMap
}

function sortCharacters (value) {
  return value.split('').sort((a, b) => a.localeCompare(b)).join('')
}

function sortAndRemoveDuplicates (line) {
  const parts = line.split(' | ')
  const values = [...parts[0].split(' '), ...parts[1].split(' ')]

  const uniqueValues = new Set()
  for (const val of values) {
    uniqueValues.add(sortCharacters(val))
  }
  const result = [...uniqueValues]
  result.sort((a, b) => b.length - a.length)
  return result
}

function getSolutionPart2 () {
  const lines = inputDataLines()
  let totalSum = 0
  console.log(getSimilarity('bceg', 'bcdefg'))
  for (const line of lines) {
    const outputvalues = sortAndRemoveDuplicates(line)
    console.log('sorted values: ')
    console.log(outputvalues)
    const mapping = getMapping(outputvalues)

    let linesum = ''
    const actualValues = line.split(' | ')[1]
    for (const val of actualValues.split(' ')) {
      console.log(val)
      linesum += String(mapping.get(sortCharacters(String(val))))
    }

    console.log(mapping)
    console.log('linesum: ' + parseInt(linesum))
    totalSum += parseInt(linesum)
  }

  return totalSum
}

const part = process.env.part || 'part1'

if (part === 'part1') { console.log(getSolutionPart1()) } else { console.log(getSolutionPart2()) }

module.exports = {
  getSolutionPart1, getSolutionPart2
}
