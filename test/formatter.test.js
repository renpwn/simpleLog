import test from 'node:test'
import assert from 'node:assert/strict'
import { format } from '../src/Formatter.js'

test('Formatter - basic text without tty', () => {
  const result = format('hello', { color: 'red' }, false)
  assert.equal(result, 'hello')
})

test('Formatter - ANSI color with tty', () => {
  const result = format('hello', { color: 'red' }, true)
  assert.ok(result.startsWith('\x1b['))
  assert.ok(result.endsWith('\x1b[0m'))
  assert.ok(result.includes('31'))
})

test('Formatter - HEX color with tty', () => {
  const result = format('hello', { color: '#ff0000' }, true)
  assert.ok(result.includes('38;2;255;0;0'))
})

test('Formatter - RGB array with tty', () => {
  const result = format('hello', { color: [0, 255, 0] }, true)
  assert.ok(result.includes('38;2;0;255;0'))
})
