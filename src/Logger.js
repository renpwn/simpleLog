import { LEVELS, LEVEL_STYLE, normalizeLevel } from './Levels.js'
import { createStringifier } from './Stringify.js'
import { formatTime } from './Time.js'
import { format } from './Formatter.js'
import { FileSink } from './FileSink.js'
import { ProgressManager } from './Progress/ProgressManager.js'

export class Logger {
  constructor(opts = {}) {
    const { level, color, truncate, maxLength, file, progress } = opts
    const isTimeEnabled = opts.time === true || (typeof opts.time === 'object' && opts.time !== null)
    const timeOpts = typeof opts.time === 'object' && opts.time !== null ? opts.time : {}
  
    this.level = normalizeLevel(level)
    this.color = !!color
    this.tty = process.stdout.isTTY && !process.env.CI

    this.time = isTimeEnabled
    this.timeLocale = timeOpts.locale
    this.template = timeOpts.template
    this.timePos = timeOpts.position || 'prefix'

    this.stringify = createStringifier( truncate || { maxLength } )
    this.file = new FileSink(file || {})

    this.progress = progress ? new ProgressManager(progress.slots || [], progress.theme) : null

    this.lastProgressLines = 0
  }

  allow(type) {
    return LEVELS[type] >= LEVELS[this.level]
  }

  style(type, user) {
    if (!this.color) return user
    return { ...LEVEL_STYLE[type], ...user }
  }

  /* ================= PROGRESS API ================= */

  update(name, cur, total, text) {
    if (!this.progress) return
    this.progress.update(name, cur, total, text)
    this.renderProgress()
  }

  remove(name) {
    if (!this.progress) return
    this.progress.remove(name)
    this.renderProgress()
  }

  updateProgress(name, cur, total, text) {
    this.update(name, cur, total, text)
  }

  removeProgress(name) {
    this.remove(name)
  }

  /* ================= RENDER CONTROL ================= */

  clearProgress() {
    if (!this.progress || !this.tty || this.lastProgressLines === 0) return

    process.stdout.write(`\x1b[${this.lastProgressLines}A`)
    for (let i = 0; i < this.lastProgressLines; i++) {
      process.stdout.write('\x1b[2K')
      process.stdout.write('\x1b[1B')
    }
    process.stdout.write(`\x1b[${this.lastProgressLines}A`)
    this.lastProgressLines = 0
  }

  renderProgress() {
    if (!this.progress || !this.tty) return

    const snapshot = this.progress.snapshot()
    if (!snapshot.length) return

    this.clearProgress()

    process.stdout.write('\n')
    for (const p of snapshot) {
      process.stdout.write(`${p.line}\n`)
    }

    this.lastProgressLines = snapshot.length + 1
  }

  /* ================= CORE WRITE ================= */

  write(type, args, style) {
    if (!this.allow(type)) return

    let userStyle = style
    const logArgs = [...args]

    if (!userStyle && logArgs.length > 1 && typeof logArgs[logArgs.length - 1] === 'object' && logArgs[logArgs.length - 1] !== null) {
      const last = logArgs[logArgs.length - 1]
      if (('color' in last || 'bg' in last || 'bold' in last || 'dim' in last) && Object.keys(last).every(k => ['color', 'bg', 'bold', 'dim'].includes(k))) {
        userStyle = logArgs.pop()
      }
    }

    const rawMsg = logArgs.map(this.stringify.toStr).join(' ')
    const t = this.time ? formatTime({locale: this.timeLocale, template: this.template}) : null

    const out =
      t && this.timePos === 'suffix'
        ? `${rawMsg} | ${t}`
        : t
        ? `${t} ${rawMsg}`
        : rawMsg

    if (this.progress) {
      this.clearProgress()
      process.stdout.write(
        format(out, this.style(type, userStyle), this.tty) + '\n'
      )
      this.renderProgress()
    } else {
      console.log(format(out, this.style(type, userStyle), this.tty))
    }

    this.file.write(type, rawMsg)
  }

  log(...a) { this.write('log', a) }
  debug(...a) { this.write('debug', a) }
  info(...a)  { this.write('info', a) }
  warn(...a)  { this.write('warn', a) }
  error(...a) { this.write('error', a) }
}