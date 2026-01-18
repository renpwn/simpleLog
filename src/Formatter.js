const COLORS = {
  black:30, red:31, green:32, yellow:33,
  blue:34, magenta:35, cyan:36, white:37
}
const BG = {
  black:40, red:41, green:42, yellow:43,
  blue:44, magenta:45, cyan:46, white:47
}

export function format(text, style, tty = true) {
  if (!tty || !style) return text

  const codes = []
  if (style.bold) codes.push(1)
  if (style.dim) codes.push(2)
  if (style.color && COLORS[style.color]) codes.push(COLORS[style.color])
  if (style.bg && BG[style.bg]) codes.push(BG[style.bg])

  return codes.length
    ? `\x1b[${codes.join(';')}m${text}\x1b[0m`
    : text
}