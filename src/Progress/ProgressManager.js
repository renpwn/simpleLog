import { ProgressRenderer } from './ProgressRenderer.js'

export class ProgressManager {
  constructor(slots = [], theme = {}) {
    this.slots = slots
    this.state = new Map()
    this.renderer = new ProgressRenderer(theme)
  }

  update(name, cur, total) {
    this.state.set(name, { cur, total })
  }

  render() {
    console.log(''); // line kosong sebelum progress
    
    for (const s of this.slots) {
      const v = this.state.get(s) || { cur: 0, total: 0 }
      console.log(this.renderer.render(s, v.cur, v.total))
    }
  }
}