import test from 'node:test'
import assert from 'node:assert/strict'
import { createStringifier } from '../src/Stringify.js'

test('Stringify - Error objects', () => {
  const { toStr } = createStringifier()
  const err = new Error('Database connection failed')
  const str = toStr(err)
  
  assert.ok(str.includes('Database connection failed'), 'Should contain error message')
  assert.ok(!str.startsWith('{}'), 'Should not serialize error as empty object')
})

test('Stringify - Nested Error inside Object', () => {
  const { toStr } = createStringifier()
  const obj = { status: 'failed', error: new Error('Query timeout') }
  const str = toStr(obj)

  assert.ok(str.includes('Query timeout'), 'Should contain nested error message')
  assert.ok(str.includes('status'), 'Should contain object fields')
})

test('Stringify - Circular references', () => {
  const { toStr } = createStringifier()
  const obj = { name: 'cyclic' }
  obj.self = obj

  const str = toStr(obj)
  assert.ok(str.includes('[Circular]'), 'Should safely handle circular reference')
})

test('Stringify - BigInt and Symbol', () => {
  const { toStr } = createStringifier()
  assert.equal(toStr(100n), '100n')
  assert.equal(toStr(Symbol('testKey')), 'Symbol(testKey)')
})

test('Stringify - Truncation', () => {
  const { toStr } = createStringifier({ maxLength: 20 })
  const longStr = 'a'.repeat(50)
  const result = toStr(longStr)

  assert.ok(result.includes('[TRUNCATED 30 chars]'))
})
