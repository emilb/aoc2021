const fs = require('fs')

function inputDataLinesIntegers (filename = 'input-test.txt') {
  return fs.readFileSync(filename).toString().trim().split('\n').map((x) => x.split('').map((n) => parseInt(n, 10)))
}

function getKeyold (x, y) {
  return x + '-' + y
}

function getKey (x, y, width) {
  return x + y * width
}

function getMovementsAndCost (grid, x, y) {
  const movements = {}
  const width = grid[0].length
  if (x > 0) { movements[getKey(x - 1, y, width)] = grid[y][x - 1] }
  if (x < grid[0].length - 1) { movements[getKey(x + 1, y, width)] = grid[y][x + 1] }

  if (y > 0) { movements[getKey(x, y - 1, width)] = grid[y - 1][x] }
  if (y < grid.length - 1) { movements[getKey(x, y + 1, width)] = grid[y + 1][x] }

  return movements
}

function buildGridInDimension (grid, dim) {
  const width = grid[0].length
  const height = grid.length

  const newWidth = width * dim
  const newHeight = height * dim

  const newGrid = new Array(newHeight)
  for (let i = 0; i < newHeight; i++) {
    newGrid[i] = new Array(newWidth)
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const originalValue = grid[y][x]

      for (let dy = 0; dy < dim; dy++) {
        for (let dx = 0; dx < dim; dx++) {
          const dSum = dx + dy
          const nextValue = originalValue + dSum > 9 ? originalValue + dSum - 9 : originalValue + dSum

          // console.log(`org: ${originalValue} nextVal: ${nextValue} dx: ${dx} dy: ${dy}`)
          newGrid[y + height * dy][x + width * dx] = nextValue
        }
      }
    }
  }

  return newGrid
}

function buildGraph (grid) {
  const width = grid[0].length
  const height = grid.length

  const graph = {}

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const key = getKey(x, y, width)
      graph[key] = getMovementsAndCost(grid, x, y)
    }
  }

  graph[getKey(width - 1, height - 1, width)] = {}
  return graph
}

const shortestDistanceNode = (distances, visited) => {
  // create a default value for shortest
  let shortest = null

  // for each node in the distances object
  for (const [node, value] of distances) {
    // if no node has been assigned to shortest yet
    // or if the current node's distance is smaller than the current shortest
    const currentIsShortest = shortest === null || value < distances.get(shortest)

    // and if the current node is in the unvisited set
    // if (currentIsShortest && !visited.includes(node)) {
    if (currentIsShortest && !visited.has(parseInt(node))) {
    // update shortest to be the current node
      shortest = node
    }
  }
  return shortest
}

const findShortestPath = (graph, startNode, endNode) => {
  // track distances from the start node using a hash object
  const distances = new Map()
  distances.set(endNode, Infinity)
  for (const [key, value] of Object.entries(graph[startNode])) {
    distances.set(key, value)
  }

  // distances = Object.assign(distances, graph[startNode])

  // track paths using a hash object
  const parents = { endNode: null }
  for (const child in graph[startNode]) {
    parents[child] = startNode
  }

  console.log('populated parents')

  // collect visited nodes
  // const visited = []
  const visited = new Set()

  // find the nearest node
  let node = shortestDistanceNode(distances, visited)

  // for that node:
  while (node) {
    // find its distance from the start node & its child nodes
    const distance = distances.get(node)
    const children = graph[node]

    // for each of those child nodes:
    for (const child in children) {
      // make sure each child node is not the start node
      if (child === startNode) {
        continue
      } else {
        // save the distance from the start node to the child node
        const newdistance = distance + children[child]
        // if there's no recorded distance from the start node to the child node in the distances object
        // or if the recorded distance is shorter than the previously stored distance from the start node to the child node
        const childDistance = distances.get(child)
        if (!childDistance || childDistance > newdistance) {
          // save the distance to the object
          distances.set(child, newdistance)
          // record the path
          parents[child] = node
        }
      }
    }
    // move the current node to the visited set
    // visited.push(node)
    visited.add(parseInt(node))

    const visitedSize = visited.size
    if (visitedSize % 1000 === 0) {
      console.log(`visited length: ${visitedSize}`)
      // console.log(visited)
    }
    // move to the nearest neighbor node
    node = shortestDistanceNode(distances, visited)
  }

  console.log('finding shortest path')
  // using the stored paths from start node to end node
  // record the shortest path
  const shortestPath = [endNode]
  let parent = parents[endNode]
  while (parent) {
    shortestPath.push(parent)
    parent = parents[parent]
  }
  shortestPath.reverse()

  // this is the shortest path
  const results = {
    distance: distances.get(endNode),
    path: shortestPath
  }
  // return the shortest path & the end node's distance from the start node
  return results
}

function getSolutionPart1 () {
  const grid = inputDataLinesIntegers()
  const width = grid[0].length
  const graph = buildGraph(grid)

  console.log('built graph')

  const startNode = getKey(0, 0, width)
  const endNode = getKey(grid[0].length - 1, grid.length - 1, width)

  // console.log(graph)
  return findShortestPath(graph, startNode, endNode)
}

function getSolutionPart2 () {
  const grid = buildGridInDimension(inputDataLinesIntegers(), 5)
  const width = grid[0].length
  /*
  const grid_correct = inputDataLinesIntegers('input-dimensioned.txt')

  let errorCount = 0
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid.length; x++) {
      if (grid[y][x] !== grid_correct[y][x]) {
        console.log('Found mismatch at: ' + x + ',' + y + ' [' + grid[y][x] + ' != ' + grid_correct[y][x] + ']')
        errorCount++
      }
    }
  }

  console.log(`errors: ${errorCount}`)
  */
  const graph = buildGraph(grid)

  console.log('built graph')
  // console.log(graph)

  const startNode = getKey(0, 0, width)
  const endNode = getKey(grid[0].length - 1, grid.length - 1, width)

  // console.log(graph)
  return findShortestPath(graph, startNode.toString(10), endNode.toString(10))
}

const part = process.env.part || 'part1'

if (part === 'part1') { console.log(getSolutionPart1()) } else { console.log(getSolutionPart2()) }

module.exports = {
  getSolutionPart1, getSolutionPart2, inputDataLinesIntegers
}
