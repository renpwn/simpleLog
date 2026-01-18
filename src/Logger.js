import { LEVELS, LEVEL_STYLE, normalizeLevel } from './Levels.js'
import { createStringifier } from './Stringify.js'
import { formatTime } from './Time.js'
import { format } from './Formatter.js'
import { FileSink } from './FileSink.js'
import { ProgressManager } from './Progress/ProgressManager.js'

export class Logger {
  constructor(opts = {}) {
    this.level = normalizeLevel(opts.level)
    this.color = !!opts.color
    this.tty = process.stdout.isTTY && !process.env.CI
    
    this.time = opts.time?.enabled
    this.timePos = opts.time?.position || 'prefix'
    
    this.stringify = createStringifier(opts.truncate || { maxLength: opts.maxLength })
    this.file = new FileSink(opts.file || {})
    
    this.progress = opts.progress
      ? new ProgressManager(opts.progress.slots || [], opts.progress.theme)
      : null
    this.lastProgressLines = 0;
    this.slots = opts.progress.slots || []
  }

  allow(type) {
    return LEVELS[type] >= LEVELS[this.level]
  }

  style(type, user) {
    if (!this.color) return user
    return { ...LEVEL_STYLE[type], ...user }
  }
  
  update(name, cur, total) {
    this.progress.render(name, cur, total)
    this.renderProgress()
  }

  clearProgress() {
    if (!this.progress) return
    if (!this.tty || this.lastProgressLines === 0) return;

    // naik ke atas sebanyak jumlah progress
    process.stdout.write(`\x1b[${this.lastProgressLines}A`);

    // clear baris progress
    for (let i = 0; i < this.lastProgressLines; i++) {
      process.stdout.write("\x1b[2K"); // clear line
      process.stdout.write("\x1b[1B"); // turun
    }
    
    // balik ke posisi awal
    process.stdout.write(`\x1b[${this.lastProgressLines}A`);
    
    this.lastProgressLines = 0;
  }

  renderProgress() {
    if (!this.progress) return
    this.clearProgress()
    this.progress.render()
    this.lastProgressLines = this.slots.length + 1;
  }

  write(type, args, style) {
    if (!this.allow(type)) return
    
    const msg = args.map(this.stringify.toStr).join(' ')
    const t = this.time ? formatTime() : null
    const out =
      t && this.timePos === 'suffix' ? `${msg} | ${t}` :
      t ? `${t} ${msg}` : msg
    
    if (this.progress){
      this.clearProgress()
      
      process.stdout.write(format(out, this.style(type, style), this.tty) + "\n");
      
      this.renderProgress()
    }else
      console.log(format(out, this.style(type, style), this.tty))
    
    this.file.write(type, out)
  }

  debug(...a){ this.write('debug', a) }
  info(...a){ this.write('info', a) }
  warn(...a){ this.write('warn', a) }
  error(...a){ this.write('error', a) }
}