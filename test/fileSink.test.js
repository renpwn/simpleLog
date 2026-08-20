import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import { FileSink } from '../src/FileSink.js'

const testDir = path.resolve(process.cwd(), 'tmp_test_logs')

test.beforeEach(() => {
  fs.mkdirSync(testDir, { recursive: true })
})

test.afterEach(() => {
  fs.rmSync(testDir, { recursive: true, force: true })
})

test('FileSink - txt format writes lines', () => {
  const logFile = path.join(testDir, 'app.log')
  const sink = new FileSink({ path: logFile, format: 'txt', backup: false })

  sink.write('info', 'Server started on port 3000')
  sink.write('warn', 'Low memory')

  const content = fs.readFileSync(logFile, 'utf8')
  assert.ok(content.includes('INFO Server started on port 3000'))
  assert.ok(content.includes('WARN Low memory'))
})

test('FileSink - json format writes valid JSONL lines without per-line backup overhead', () => {
  const jsonFile = path.join(testDir, 'app.json')
  const sink = new FileSink({ path: jsonFile, format: 'json', backup: false })

  for (let i = 0; i < 50; i++) {
    sink.write('info', `Message ${i}`)
  }

  const lines = fs.readFileSync(jsonFile, 'utf8').trim().split('\n')
  assert.equal(lines.length, 50)
  
  const parsedFirst = JSON.parse(lines[0])
  assert.equal(parsedFirst.level, 'info')
  assert.equal(parsedFirst.message, 'Message 0')
  assert.ok(parsedFirst.time)
})

test('FileSink - startup backup creates .bak once for existing file', () => {
  const logFile = path.join(testDir, 'existing.log')
  fs.writeFileSync(logFile, 'initial line\n')

  const sink = new FileSink({ path: logFile, format: 'txt', backup: true })
  sink.write('info', 'new line')

  assert.ok(fs.existsSync(logFile + '.bak'), 'Backup file .bak should exist')
  const bakContent = fs.readFileSync(logFile + '.bak', 'utf8')
  assert.equal(bakContent, 'initial line\n')
})
