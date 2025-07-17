'use client'

import { useState, useEffect } from 'react'
import styles from '../styles/display.module.css'
import { ref, set, onValue } from 'firebase/database'
import { database } from '../firebase'

const fields = [
  'USB王', '跳高王', '擲筊王', '高音王',
  '海賊王', '下腰王', '準時王', '乾眼王',
  '色盲王', '錯王', '蟹堡王', '神射王',
  '搧大王', '守門王', '定格王', '反應王',
]

const units = [
  '秒', '公分', '次', '音',
  '分', '公分', '秒', '秒',
  '題', '題', '題', '杯',
  '杯', '顆', '公分', '毫秒'
]

// 排序邏輯
const compareFunctions = {
  'USB王': (a, b) => parseFloat(a) - parseFloat(b),
  '跳高王': (a, b) => parseFloat(b) - parseFloat(a),
  '擲筊王': (a, b) => parseInt(b) - parseInt(a),
  '高音王': (a, b) => pitchToValue(b) - pitchToValue(a),
  '海賊王': (a, b) => parseInt(b) - parseInt(a),
  '下腰王': (a, b) => parseFloat(a) - parseFloat(b),
  '準時王': (a, b) => parseFloat(a) - parseFloat(b),
  '乾眼王': (a, b) => parseFloat(b) - parseFloat(a),
  '色盲王': (a, b) => parseInt(b) - parseInt(a),
  '錯王': (a, b) => parseInt(b) - parseInt(a),
  '蟹堡王': (a, b) => parseInt(b) - parseInt(a),
  '神射王': (a, b) => parseInt(b) - parseInt(a),
  '搧大王': (a, b) => parseInt(b) - parseInt(a),
  '守門王': (a, b) => parseInt(b) - parseInt(a),
  '定格王': (a, b) => parseFloat(a) - parseFloat(b),
  '反應王': (a, b) => parseFloat(a) - parseFloat(b),
}

// 音高轉換邏輯
function pitchToValue(pitch) {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const match = pitch.match(/^([A-G]#?)(\d)$/)
  if (!match) return -1
  const [, note, octave] = match
  const index = notes.indexOf(note)
  return index + parseInt(octave) * 12
}

export default function Home() {
  const [data, setData] = useState({})
  const [inputs, setInputs] = useState({})

  useEffect(() => {
    const dbRef = ref(database, 'scoreData')
    return onValue(dbRef, (snapshot) => {
      const value = snapshot.val()
      if (value) setData(value)
    })
  }, [])

  const handleInputChange = (field, key, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [key]: value
      }
    }))
  }

  const handleAddScore = (field) => {
    const { name = '', score = '', team = '' } = inputs[field] || {}
    if (!name || !score || !team) return

    const compare = compareFunctions[field]
    const list = data[field] || []

    // 找到是否已有同名
    const existingIndex = list.findIndex(entry => entry.name === name)
    let updatedList = [...list]

    if (existingIndex !== -1) {
      const isBetter = compare(score, list[existingIndex].score) < 0
      if (!isBetter) return // 新成績較差，忽略
      updatedList.splice(existingIndex, 1)
    }

    updatedList.push({ name, score, team })
    updatedList.sort((a, b) => compare(a.score, b.score))

    while (updatedList.length < 5) updatedList.push({ name: '', score: '', team: '' })
    updatedList = updatedList.slice(0, 5)

    set(ref(database, `scoreData/${field}`), updatedList)
    setInputs(prev => ({ ...prev, [field]: { name: '', score: '', team: '' } }))
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
      <h2 style={{ color: 'white' }}>控場介面</h2>

      <div className={styles.grid}>
        {fields.map((field, fIndex) => {
          const input = inputs[field] || {}
          return (
            <div key={field} className={styles.card}>
              <strong>{field}</strong>
              <div className={styles.row}>
                <input
                  placeholder="記錄保持人"
                  value={input.name || ''}
                  onChange={e => handleInputChange(field, 'name', e.target.value)}
                  style={{ color: input.name ? '#000' : '#aaa' }}
                />
                <input
                  placeholder={`成績（${units[fIndex]}）`}
                  value={input.score || ''}
                  onChange={e => handleInputChange(field, 'score', e.target.value)}
                  style={{ color: input.score ? '#000' : '#aaa' }}
                  pattern={field === '高音王' ? '[A-G]#?[0-8]' : undefined}
                />
                <select
                  value={input.team || ''}
                  onChange={e => handleInputChange(field, 'team', e.target.value)}
                  style={{ color: input.team ? '#000' : '#aaa' }}
                >
                  <option value="">未選擇班級</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={i + 1}>{`天惠 ${i + 1} 班`}</option>
                  ))}
                </select>
                <button onClick={() => handleAddScore(field)}>➕ 加入</button>
              </div>

              {(data[field] || []).map((entry, i) => (
                <div key={i} className={styles.row}>
                  <span>{['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][i]}</span>
                  <div>{entry.name}</div>
                  <div>{entry.score}</div>
                  <div>{entry.team ? `天惠 ${entry.team} 班` : ''}</div>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      <hr />
      <h3 style={{ color: 'white' }}>總積分</h3>
      <div className={styles.points}>
        {teamPoints.map((p, i) => (
          <div key={i}>天惠 {i + 1} 班：{p} 分</div>
        ))}
      </div>

      <button
        onClick={() => {
          const pw = prompt("請輸入密碼以清除所有資料")
          if (pw === "159357") {
            set(ref(database, 'scoreData'), {})
          } else {
            alert("密碼錯誤，操作已取消")
          }
        }}
        style={{
          backgroundColor: 'red',
          color: 'white',
          fontSize: '18px',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          marginTop: '40px',
          cursor: 'pointer'
        }}
      >
        🔄 初始化所有成績
      </button>
    </div>
  )
}
