# simpleLog

> Lightweight, opinionated, **TTY-aware logger** for Node.js with progress bar, file output, safe stringify, and zero dependencies.

[![NPM](https://img.shields.io/npm/v/@renpwn/simplelog)](https://www.npmjs.com/package/@renpwn/simplelog)
[![Downloads](https://img.shields.io/npm/dm/@renpwn/simplelog)](https://www.npmjs.com/package/@renpwn/simplelog)
[![License](https://img.shields.io/npm/l/@renpwn/simplelog)](LICENSE)

---

## ✨ Features

- 🎨 Colored log levels (log, debug, info, warn, error)
- 🧠 Safe stringify (object → JSON, anti crash, truncate)
- 🕒 Timestamp with locale (`id`, `en`)
- 📁 File logging (TXT / JSONL + auto backup)
- 📊 Multi progress bar (TTY-aware, auto redraw)
- 🧹 Non-TTY & CI safe
- ⚡ Zero dependencies
- 🧩 Modular & audit-friendly

---

## 📦 Installation

### NPM
```bash
npm install @renpwn/simplelog
```

### Yarn
```bash
yarn add @renpwn/simplelog
```

### Git Clone
```bash
git clone https://github.com/renpwn/simpleLog.git
cd simpleLog
npm install
```

---

## 🚀 Quick Start (Minimal)

```js
import { simpleLog } from '@renpwn/simplelog'

const log = simpleLog()

log.log('hello')
log.info('info message')
log.warn('warning')
log.error('error')
```

---

## 🧠 Full Usage Example

### 1️⃣ Logger dengan Level, Warna & Waktu

```js
import { simpleLog } from '@renpwn/simplelog'

const log = simpleLog({
  level: 'debug',   // log | debug | info | warn | error | silent
  color: true,      // enable ANSI color
  time: {
    locale: 'id',   // id | en
    position: 'prefix' // prefix | suffix
  }
})

log.debug('Debug message')
log.info('Server started')
log.warn('Memory usage high')
log.error({ code: 500, msg: 'Fatal error' })
```

📌 **Keterangan**
- `level` → filter minimum level yang ditampilkan
- `color` → otomatis nonaktif jika non-TTY
- `time` → format waktu ringkas & konsisten

---

### 2️⃣ Safe Stringify & Truncate

```js
const log = simpleLog({
  truncate: {
    maxLength: 200
  }
})

log.info({
  veryLongData: 'x'.repeat(1000)
})
```

📌 Object akan di-`JSON.stringify`, dan otomatis dipotong jika terlalu panjang.

---

### 3️⃣ File Logging (TXT & JSONL)

#### TXT (default)
```js
const log = simpleLog({
  file: {
    path: 'logs/app.log'
  }
})

log.info('App started')
```

Output:
```
[2026-01-20T07:21:10.120Z] INFO App started
```

#### JSONL
```js
const log = simpleLog({
  file: {
    path: 'logs/app.json',
    format: 'json'
  }
})
```

Output:
```json
{"time":"2026-01-20T07:21:10.120Z","level":"info","message":"App started"}
```

📌 File write aman dengan auto-backup `.bak`.

---

### 4️⃣ Progress Bar (Multi Slot)

```js
const log = simpleLog({
  progress: {
    slots: [
      ['Scraping', { color: 'cyan' }],
      ['DB Queue', 'auto']
    ]
  }
})

let i = 0
const timer = setInterval(() => {
  i++
  log.updateProgress('Scraping', i, 10, 'fetching...')
  log.updateProgress('DB Queue', i * 2, 20)

  if (i >= 10) {
    clearInterval(timer)
    log.info('All jobs finished')
  }
}, 300)
```

📌 **Catatan**
- Progress hanya muncul di TTY
- Log biasa akan membersihkan progress lalu merender ulang

---

### 5️⃣ Custom Progress Theme

```js
const log = simpleLog({
  progress: {
    slots: ['Download'],
    theme: {
      size: 30,
      filled: '█',
      empty: '░',
      left: '[',
      right: ']',
      style: { color: 'green' }
    }
  }
})
```

---

## 🧩 API Ringkas

```js
log.log(...args)
log.debug(...args)
log.info(...args)
log.warn(...args)
log.error(...args)

log.updateProgress(name, cur, total, text?)
log.removeProgress(name)
```

---

## 🧠 Architecture

### console.log
```
console.log()
   ↓
 stdout
```

❌ No level  
❌ No file  
❌ No progress  
❌ No safety  

---

### simpleLog
```
simpleLog()
   │
   ├─ Levels (filter)
   ├─ Time formatter
   ├─ Safe stringify
   ├─ ANSI formatter
   ├─ FileSink (txt / jsonl)
   │
   └─ ProgressManager
        └─ ProgressRenderer
             ↓
           stdout (TTY aware)
```

---

## 📂 Project Structure

```
simplelog/
├─ package.json
└─ src/
   ├─ index.js                # entry point (simpleLog)
   │
   ├─ Logger.js               # logger utama
   ├─ Levels.js               # level & style
   ├─ Formatter.js            # ANSI formatter
   ├─ Stringify.js            # stringify + truncate
   ├─ Time.js                 # time formatter
   ├─ FileSink.js             # file logging
   │
   └─ Progress/
      ├─ ProgressManager.js   # progress state
      └─ ProgressRenderer.js  # progress bar renderer
```

---

## 🧠 Design Philosophy

- Small core
- No dependency
- Predictable output
- Audit friendly
- Library-first design

Cocok untuk:
- CLI tools
- Bot WhatsApp / Telegram
- Scraper
- Worker / queue
- Base library (`simpleStore`, `simpleFetch`, dll)

---

## 🔗 Links

- GitHub  
  https://github.com/renpwn/simpleLog

- NPM  
  https://www.npmjs.com/package/@renpwn/simplelog

---

## 📄 License

MIT © RenPwn
