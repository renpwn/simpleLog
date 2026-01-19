import { ProgressRenderer } from './ProgressRenderer.js'

export class ProgressManager {
  constructor(slots = [], theme = {}) {
    this.slots = slots
    this.state = new Map()
    this.renderer = new ProgressRenderer(theme)
  }

  update(name, cur, total, text = "", style = {}) {
    this.state.set(name, {
      cur,
      total: total < cur ? cur : total,
      text,
      start: Date.now(),
      style
    })
  }

  remove(name) {
    this.state.delete(name)
  }

  clear() {
    this.state.clear()
  }

  snapshot() {
    return this.slots.map(name => {
      const v = this.state.get(name) || { cur: 0, total: 0, text: '' }

      const percent = v.total
        ? Math.floor((v.cur / v.total) * 100)
        : 0

      const elapsed = v.start
        ? Math.floor((Date.now() - v.start) / 1000)
        : 0

      const eta =
        v.cur && v.total && elapsed
          ? Math.floor((elapsed / v.cur) * (v.total - v.cur))
          : null

      return {
        name,
        cur: v.cur,
        total: v.total,
        percent,
        elapsed,
        eta,
        text: v.text,
        line: this.renderer.render(name, v.cur, v.total, v.style)
      }
    })
  }
}