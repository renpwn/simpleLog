export class ProgressRenderer {
  constructor({ size = 20, filled = '█', empty = '░' } = {}) {
    this.size = size
    this.filled = filled
    this.empty = empty
  }

  render(name, cur, total) {
    if (!total) total = 1
    const percent = Math.floor((cur / total) * 100)
    const filled = Math.min(
      this.size,
      Math.max(0, Math.floor(percent / 100 * this.size))
    )

    return `${name} [${this.filled.repeat(filled)}${this.empty.repeat(this.size - filled)}] ${percent}%`
  }
}