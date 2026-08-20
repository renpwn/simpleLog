import test from 'node:test'
import assert from 'node:assert/strict'
import { formatTime } from '../src/Time.js'

test('Time - default template with Indonesian locale', () => {
  const d = new Date(2026, 7, 21, 10, 30, 45) // 21 Aug 2026, Friday (Jumat)
  const result = formatTime({ locale: 'id', date: d })
  
  assert.ok(result.includes('JUM'))
  assert.ok(result.includes('21.AGS'))
  assert.ok(result.includes('10:30:45'))
})

test('Time - English locale', () => {
  const d = new Date(2026, 7, 21, 10, 30, 45)
  const result = formatTime({ locale: 'en', date: d })
  
  assert.ok(result.includes('FRI'))
  assert.ok(result.includes('21.AUG'))
})

test('Time - custom template tokens', () => {
  const d = new Date(2026, 7, 21, 10, 30, 45)
  const result = formatTime({
    template: '{YYYY}/{MM}/{DD} {HH}:{mm}:{ss}',
    date: d
  })
  
  assert.equal(result, '2026/08/21 10:30:45')
})
