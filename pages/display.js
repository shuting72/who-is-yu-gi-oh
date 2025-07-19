'use client'

import { useEffect, useState } from 'react'
import styles from '../styles/display.module.css'

import { ref, onValue } from 'firebase/database'
import { database } from '../firebase'

const fields = [
  'USB王', '跳高王', '擲筊王', '高音王',
  '海賊王', '下腰王', '準時王', '乾眼王',
  '色盲王', '錯王', '蟹堡王', '神射王',
  '搧大王', '守門王', '定格王', '反應王',
]

const icons = [
  '💾', '🔔', '🩴', '🎵',
  '🏴‍☠️', '📏', '⏰', '👁️',
  '🕶️', '❌', '🍔', '🎯',
  '🪭', '🥅', '🤖', '⚡',
]

const units = [
  '秒', '公分', '次', '音',
  '分', '公分', '秒', '秒',
  '題', '題', '題', '杯',
  '杯', '顆', '公分', '毫秒'
]

const colors = [
  'red', 'orange', 'yellow', 'lime',
  'green', 'cyan', 'blue', 'purple',
  'pink', 'brown'
]

export default function Display() {
  const [data, setData] = useState({})
  const [page, setPage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPage(p => (p + 1) % 9)
    }, page === 0 ? 15000 : 7000)
    return () => clearInterval(interval)
  }, [page])

  useEffect(() => {
    const dbRef = ref(database, 'scoreData')
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const value = snapshot.val()
      setData(value || {})
    })
    return () => unsubscribe()
  }, [])

  if (page === 0) {
    return (
      <div className={styles.grid16}>
        {fields.map((field, i) => {
          const first = data[field]?.[0]
          const team = parseInt(first?.team)
          const bg = colors[team - 1] || 'white'
          return (
            <div key={field} className={`${styles.block} ${styles[bg]}`}>
              <div className={styles.icon}>{icons[i]} {field}</div>
              <div className={styles.score}>成績：{first?.score || '--'}{first?.score ? units[i] : ''}</div>
              <div className={styles.name}>👑 {first?.name || '--'}</div>
            </div>
          )
        })}
      </div>
    )
  }

  const pair = [(page - 1) * 2, (page - 1) * 2 + 1]

  return (
    <div className={styles.carousel}>
      {pair.map(i => (
        <div key={i} className={styles.panel}>
          <div className={styles.title}>{icons[i]} {fields[i]}</div>
          <div className={styles.rankings}>
            {(data[fields[i]] || []).map((entry, j) => (
              <div key={j} className={styles.rankingItem} style={{ animationDelay: `${j * 0.3}s` }}>
                <span className={styles.rankIcon}>{['🥇','🥈','🥉','4️⃣','5️⃣'][j]}</span>
                <span className={styles.nameText}>{entry.name || '--'}</span>
                <span className={styles.scoreText}>{entry.score || '--'}{entry.score ? units[i] : ''}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
