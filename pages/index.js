// pages/index.js
'use client'

import { useState, useEffect } from 'react'
import styles from '../styles/display.module.css'
import { ref, set, onValue, push } from 'firebase/database'
import { database } from '../firebase'

const fields = [
  'USB王', '跳高王', '擲筊王', '高音王',
  '海賊王', '下腰王', '準時王', '乾眼王',
  '色盲王', '錯王', '蟹堡王', '神射王',
  '搧大王', '守門王', '定格王', '反應王'
]

const units = [
  '秒', '公分', '次', '音',
  '分', '公分', '秒', '秒',
  '題', '題', '題', '杯',
  '杯', '顆', '公分', '毫秒'
]

const placeholders = [
  '3.24', '', '', '如：C4',
  '', '35.24', '3.24', '30.24',
  '', '', '', '',
  '', '', '3.24', ''
]

// 高音排序對照表（A0～C8）
const pitchOrder = (() => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const result = {}
  let index = 0
  for (let octave = 0; octave <= 8; octave++) {
    for (let note of notes) {
      const name = note + octave
      result[name] = index++
    }
  }
  return result
})()

export default function Home() {
  const [data, setData] = useState({})

  useEffect(() => {
    const dbRef = ref(database, 'scoreData')
    return onValue(dbRef, snapshot => {
      const value = snapshot.val()
      if (value) setData(value)
    })
  }, [])

  const compare = (field, a, b) => {
    if (!a || !b) return 0
    const i = fields.indexOf(field)
    const scoreA = a.score
    const scoreB = b.score
    const toFloat = s => parseFloat(s.replace(/[^\d.]/g, ''))

    // 特殊：高音王
    if (field === '高音王') {
      const getPitch = s => pitchOrder[s.toUpperCase()] ?? -1
      return getPitch(b.score) - getPitch(a.score)
    }

    // 越低越好（反向排序）
    const lowerIsBetter = ['USB王', '下腰王', '準時王', '定格王', '反應王']
    if (lowerIsBetter.includes(field)) {
      return toFloat(a.score) - toFloat(b.score)
    }

    // 越高越好（正常排序）
    return toFloat(b.score) - toFloat(a.score)
  }

  const handleChange = (field, name, score, team) => {
    const updated = data[field] ? [...data[field]] : []
    updated.push({ name, score, team })
    updated.sort((a, b) => compare(field, a, b))
    const top5 = updated.slice(0, 5)
    set(ref(database, `scoreData/${field}`), top5)
  }

  const teamPoints = Array(10).fill(0)
  fields.forEach(field => {
    if (data[field]) {
      data[field].forEach((entry, i) => {
        const teamIndex = parseInt(entry.team)
        if (!isNaN(teamIndex) && teamIndex >= 1 && teamIndex <= 10) {
          teamPoints[teamIndex - 1] += 5 - i
        }
      })
    }
  })

  return (
    <div className={styles.admin}>
      <h2 style={{ color: 'white' }}>控場介面（自動排序）</h2>

      <div className={styles.grid}>
        {fields.map((field, fIndex) => (
          <div key={field} className={styles.card}>
            <strong>{field}</strong>
            <div className={styles.row}>
              <input placeholder="記錄保持人" id={`name-${field}`} />
              <input placeholder={placeholders[fIndex] ? `成績（${units[fIndex]}，例如：${placeholders[fIndex]}）` : `成績（${units[fIndex]}）`} id={`score-${field}`} />
              <select id={`team-${field}`}>
                <option value="">選擇班級</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>{`天惠 ${i + 1} 班`}</option>
                ))}
              </select>
              <button onClick={() => {
                const name = document.getElementById(`name-${field}`).value
                const score = document.getElementById(`score-${field}`).value
                const team = document.getElementById(`team-${field}`).value
                if (name && score && team) {
                  handleChange(field, name, score, team)
                } else {
                  alert('請輸入完整資訊')
                }
              }}>送出</button>
            </div>

            {(data[field] || Array(5).fill({})).map((entry, i) => (
              <div key={i} className={styles.row}>
                <span>{['🥇','🥈','🥉','4️⃣','5️⃣'][i]}</span>
                <span>{entry.name || '-'}</span>
                <span>{entry.score || '-'}</span>
                <span>{entry.team ? `天惠 ${entry.team} 班` : '-'}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <hr />

      <h3 style={{ color: 'white' }}>總積分</h3>
      <div className={styles.points}>
        {teamPoints.map((p, i) => (
          <div key={i}>天惠 {i + 1} 班：{p} 分</div>
        ))}
      </div>
    </div>
  )
}
