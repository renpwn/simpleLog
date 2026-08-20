import test from 'node:test'
import assert from 'node:assert/strict'
import { simpleLog, Logger, LEVELS } from '../src/index.js'

test('Logger - simpleLog factory creates Logger instance', () => {
  const log = simpleLog()
  assert.ok(log instanceof Logger)
})

test('Logger - level filtering', () => {
  const log = simpleLog({ level: 'warn' })
  assert.equal(log.allow('debug'), false)
  assert.equal(log.allow('info'), false)
  assert.equal(log.allow('warn'), true)
  assert.equal(log.allow('error'), true)
})

test('Logger - time option is properly disabled when false', () => {
  const log = simpleLog({ time: false })
  assert.equal(log.time, false)
})

test('Logger - time option is enabled when true or object', () => {
  const log1 = simpleLog({ time: true })
  assert.equal(log1.time, true)

  const log2 = simpleLog({ time: { locale: 'en' } })
  assert.equal(log2.time, true)
  assert.equal(log2.timeLocale, 'en')
})

test('Logger - updateProgress and removeProgress methods exist', () => {
  const log = simpleLog({
    progress: { slots: ['task1'] }
  })
  
  assert.equal(typeof log.updateProgress, 'function')
  assert.equal(typeof log.removeProgress, 'function')
  assert.doesNotThrow(() => {
    log.updateProgress('task1', 5, 10, 'halfway')
    log.removeProgress('task1')
  })
})
