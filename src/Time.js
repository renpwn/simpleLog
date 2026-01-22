const LOCALES = {
  id: {
    days: ["MIN","SEN","SEL","RAB","KAM","JUM","SAB"],
    mons: ["JAN","FEB","MAR","APR","MEI","JUN","JUL","AGS","SEP","OKT","NOV","DES"]
  },
  en: {
    days: ["SUN","MON","TUE","WED","THU","FRI","SAT"],
    mons: ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
  }
}


export function formatTime({
  locale = 'id',
  date = new Date(),
  template ='[{DAY}|{DD}.{MON}|{TIME}]'
} = {}) {
  const l = LOCALES[locale] || LOCALES.id
  const d = date
  
  const pad = n => String(n).padStart(2, '0')
  
  const map = {
    iso: d.toISOString(),
    
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
    ms: d.getMilliseconds(),
    
    TIME: d.toTimeString().split(' ')[0],
    
    YYYY: d.getFullYear(),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),

    // locale-based tokens
    DAY: l.days[d.getDay()],
    MON: l.mons[d.getMonth()]
  }
  

  return template.replace(/\{(\w+)\}/g, (_, k) => map[k] ?? '')
}