export function formatTime() {
  const d = new Date()
  const days = ["MIN","SEN","SEL","RAB","KAM","JUM","SAB"]
  const mons = ["JAN","FEB","MAR","APR","MEI","JUN","JUL","AGS","SEP","OKT","NOV","DES"]
  return `${days[d.getDay()]}|${String(d.getDate()).padStart(2,'0')}.${mons[d.getMonth()]}|${d.toTimeString().split(' ')[0]}`
}