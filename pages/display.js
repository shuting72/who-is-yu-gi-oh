import styles from '../styles/display.module.css'
import { useEffect, useState } from 'react'

const stages = [
  "USB王","跳高王","擲筊王","高音王",
  "海賊王","下腰王","準時王","乾眼王",
  "色盲王","錯王","蟹堡王","神射王",
  "搧大王","守門王","定格王","反應王"
]
const icons = [
  "💾","🔔","🩴","🎵",
  "🏴‍☠️","📏","⏰","👁️",
  "🕶️","❌","🍔","🎯",
  "🪭","🥅","🤖","⚡"
]

export default function Display() {
  const [idx, setIdx] = useState(0)
  const [data, setData] = useState({})

  useEffect(()=>{
    const saved = localStorage.getItem('scoreboard')
    if(saved) setData(JSON.parse(saved))
  },[])

  useEffect(()=>{
    const iv = setInterval(()=>{
      setIdx(i => (i+1)%2)  // 0 顯總表，1 顯輪播
    }, idx===0?15000:7000)
    return ()=>clearInterval(iv)
  },[idx])

  if(idx===0){
    return (
      <div className={styles.grid}>
        {stages.map((s,i)=> {
          const rec = data[s]?.[0] || {}
          return (
            <div key={s} className={styles.card} style={{backgroundColor: data[s]?.color||'#f00'}}>
              <div className={styles.stageTitle}>{icons[i]} {s}</div>
              <div className={styles.score}>
                成績：{rec.score||"--"}{rec.unit?` ${rec.unit}`:""}
              </div>
              <div className={styles.champion}>
                👑 {rec.name||"--"}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // 輪播只顯示兩關
  const left =  idx*2
  const right = left+1

  const renderBlock = i => {
    const s = stages[i]
    const recs = data[s]||[]
    return (
      <div key={s} className={styles.block}>
        <div className={styles.stage}>{icons[i]} {s}</div>
        {recs.slice(0,5).map((r,j)=>(
          <div key={j} className={styles.entry}>
            {['🥇','🥈','🥉','4️⃣','5️⃣'][j]} {r.name||"--"} — {r.score||"--"}{r.unit?` ${r.unit}`:""}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.carousel}>
      {renderBlock(left)}
      {right<stages.length && renderBlock(right)}
    </div>
  )
}
