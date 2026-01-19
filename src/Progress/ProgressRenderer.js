import { format } from '../Formatter.js'

export class ProgressRenderer {
  constructor({ size = 20, filled = '█', empty = '░', color = null, bg = null, left = '[', right = ']'} = {}) {
    this.size = size
    this.filled = filled
    this.empty = empty
    this.color = color
    this.bg = bg
    this.left = left
    this.right = right
  }

  render(name, cur, total, style = {}) {
    if (!total) total = 1
    const percent = Math.floor((cur / total) * 100)
    const filled = Math.min(
      this.size,
      Math.max(0, Math.floor(percent / 100 * this.size))
    )
    
    const bar = format(this.filled.repeat(filled) + this.empty.repeat(this.size - filled), style, true)

    return `${name} ${this.left}${bar}${this.right} ${percent}%`
  }
}