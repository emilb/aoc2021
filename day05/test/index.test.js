
const { coordinateToPosition, positionToCoordinate, getSolutionPart1, getSolutionPart2 } = require('../index')

test('coordinateToPosition', () => {
  expect(coordinateToPosition(4, 8, 9)).toBe(76)
})

test('positionToCoordinate', () => {
  expect(positionToCoordinate(76, 9)).toEqual({ x: 4, y: 8 })
})

test('part1', () => {
  expect(getSolutionPart1('input-test.txt')).toBe(5)
})

test('part2', () => {
  expect(getSolutionPart2('input-test.txt')).toBe(12)
})
