export function createStringifier(opts = {}) {
  const enabled = opts.enabled !== false
  const max = Number.isInteger(opts.maxLength) ? opts.maxLength : 500

  function truncate(str) {
    if (typeof str !== 'string') str = String(str ?? '')
    if (!enabled) return str
    if (str.length > max) {
      return str.slice(0, max) +
        `... [TRUNCATED ${str.length - max} chars]`
    }
    return str
  }

  function getCircularReplacer() {
    const seen = new WeakSet()
    return (key, value) => {
      if (typeof value === 'bigint') {
        return `${value.toString()}n`
      }
      if (value instanceof Error) {
        return {
          name: value.name,
          message: value.message,
          stack: value.stack,
          ...value
        }
      }
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]'
        }
        seen.add(value)
      }
      return value
    }
  }

  function toStr(v) {
    if (v instanceof Error) {
      return truncate(v.stack || `${v.name}: ${v.message}`)
    }
    if (typeof v === 'symbol') {
      return truncate(v.toString())
    }
    if (typeof v === 'bigint') {
      return truncate(`${v.toString()}n`)
    }
    if (typeof v === 'object' && v !== null) {
      try {
        const json = JSON.stringify(v, getCircularReplacer(), 2)
        return truncate(json !== undefined ? json : String(v))
      } catch {
        return truncate(String(v))
      }
    }
    return truncate(String(v))
  }

  return { toStr }
}