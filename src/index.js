import { Logger } from './Logger.js'
import { LEVELS, LEVEL_STYLE } from './Levels.js'
import { formatTime } from './Time.js'
import { format } from './Formatter.js'

export function simpleLog(options) {
  return new Logger(options)
}

export { Logger, LEVELS, LEVEL_STYLE, formatTime, format }
export default simpleLog