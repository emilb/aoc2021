const fs = require('fs')

const boardsize = 5

function inputDataLinesIntegers (filename = 'input.txt') {
  const bingodata = {}

  const datarows = fs.readFileSync(filename).toString().trim().split('\n').map((x) => x)

  bingodata.drawnumbers = datarows[0].split(',').map((x) => parseInt(x))
  bingodata.boards = []

  for (let i = 2; i < datarows.length; i += boardsize + 1) {
    const board = []

    for (let br = 0; br < boardsize; br++) {
      board.push(datarows[i + br].trim().split(/[ ]+/).map((x) => { return { number: parseInt(x), drawn: false } }))
    }

    bingodata.boards.push(board)
  }

  return bingodata
}

function printboard (board) {
  board.forEach(element => {
    console.log(element)
  })
  console.log('\n')
}

function updateBoard (board, draw) {
  board.forEach(row => {
    row.forEach(pos => {
      if (pos.number === draw) {
        pos.drawn = true
      }
    })
  })
}

function checkForBingoInRow (board, row) {
  const boardrow = board[row]

  return boardrow.reduce((prev, curr) => prev + (curr.drawn ? 1 : 0), 0) === boardsize
}

function checkForBingoInColumn (board, col) {
  let sum = 0
  board.forEach(row => {
    sum += row[col].drawn ? 1 : 0
  })
  return sum === boardsize
}

function isBingo (board) {
  for (let i = 0; i < boardsize; i++) {
    if (checkForBingoInRow(board, i)) { return true }
    if (checkForBingoInColumn(board, i)) { return true }
  }
}

function getSumOfUnmarkedPositions (board) {
  return board.reduce((prev, curr) => { return prev + (curr.reduce((p, c) => p + (c.drawn ? 0 : c.number), 0)) }, 0)
}

function getSolutionPart1 () {
  const bingodata = inputDataLinesIntegers()

  for (const draw of bingodata.drawnumbers) {
    console.log('drawing number: ' + draw)
    for (const board of bingodata.boards) {
      updateBoard(board, draw)

      if (isBingo(board)) {
        console.log('found at ' + draw)
        printboard(board)
        return getSumOfUnmarkedPositions(board) * draw
      }
    }
  }

  return 0
}

function getSolutionPart2 () {
  const bingodata = inputDataLinesIntegers()

  for (const draw of bingodata.drawnumbers) {
    const bingoboards = []
    for (const board of bingodata.boards) {
      updateBoard(board, draw)

      if (!isBingo(board)) {
        bingoboards.push(board)
      } else {
        if (bingodata.boards.length === 1) {
          return getSumOfUnmarkedPositions(board) * draw
        }
      }
    }
    bingodata.boards = bingoboards
  }
}

const part = process.env.part || 'part1'

if (part === 'part1') { console.log(getSolutionPart1()) } else { console.log(getSolutionPart2()) }
