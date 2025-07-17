'use client'

import { useEffect, useState } from 'react'
import { ref, onValue, set, push } from 'firebase/database'
import { database } from '../firebase'
import styles from '../styles/display.module.css'

// 關卡與單位
const fields = [
  'USB王', '跳高王', '擲筊王', '高音王',
  '海賊王', '下腰王', '準時王', '乾眼王',
  '色盲王', '錯王', '蟹堡王', '神射王',
  '搧大王', '守門王', '定格王', '反應王'
]

const units = [
  '秒', '公分', '次', 'A0 ~ C8',
  '分', '公分', '秒', '秒',
  '題', '題', '題', '杯',
  '杯', '顆', '公分', '毫秒'
]

// 高音排序對照表
const pitchOrder = [
  'A0', 'B0',
  'C1', 'D1', 'E1', 'F1', 'G1',
  'A1', 'B1',
  'C2', 'D2', 'E2', 'F2', 'G2',
  'A2', 'B2',
  'C3', 'D3', 'E3', 'F3', 'G3',
  'A3', 'B3',
  'C4', 'D4', 'E4', 'F4', 'G4',
  'A4', 'B4',
  'C5', 'D5', 'E5', 'F5', 'G5',
  'A5', 'B5',
  'C6', 'D6', 'E6', 'F6', 'G6',
  'A6', 'B6',
  'C7', 'D7', 'E7', 'F7', 'G7',
  'A7', 'B7',
  'C8'
]

// 排序邏輯
const compare = (field, a, b) => {
  const af = a.score, bf = b.score
  const numA = parseFloat(af), numB = parseFloat(bf)

  const getPitchIndex = pitch => pitchOrder.indexOf(pitch)

  switch (field) {
    case 'USB王':
    case '準時王':
    case '定格王':
    case '反應王':
    case '下腰王':
      return numA - numB
    case '跳高王':
    case '擲筊王':
    case '海賊王':
    case '乾眼王':
    case '色盲王':
    case '錯王':
    case '蟹堡王':
    case '神射王':
    case '搧大王':
    case '守門王':
      return numB - numA
    case '高音王':
      return getPitchIndex(bf) - getPitchIndex(af)
    default:
      return 0
  }
}

export default function AdminPage() {
  const [data, setData] = useState({})
  const [inputs, setInputs] = useState({})

  useEffect(() => {
    const dbRef = ref(database, 'scoreData')
    return onValue(dbRef, (snapshot) => {
      const value = snapshot.val() || {}
      setData(value)
    })
  }, [])

  const handleInput = (field, key, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [key]: value
      }
    }))
  }

  const handleSubmit = (field) => {
    const input = inputs[field]
    if (!input || !input.name || !input.score || !input.team) return

    const newEntry = { ...input }
    let updated = (data[field] || []).filter(e => e.name !== newEntry.name)
    updated.push(newEntry)
    updated.sort((a, b) => compare(field, a, b))
    updated = updated.slice(0, 5)

    set(ref(database, `scoreData/${field}`), updated)
    setInputs(prev => ({ ...prev, [field]: { name: '', score: '', team: '' } }))
  }

  // 各隊總分
  const teamPoints = Array(10).fill(0)
  for (const field of fields) {
    if (data[field]) {
      data[field].forEach((entry, i) => {
        const team = parseInt(entry.team)
        if (!isNaN(team) && team >= 1 && team <= 10) {
          teamPoints[team - 1] += 5 - i
        }
      })
    }
  }

  return (
    <div className={styles.admin}>
      <h2 style={{ color: 'white' }}>控場介面</h2>

      <div className={styles.grid}>
        {fields.map((field, fIndex) => (
          <div key={field} className={styles.card}>
            <strong>{field}</strong>
            <div className={styles.row}>
              <input
                placeholder="記錄保持人"
                value={inputs[field]?.name || ''}
                onChange={e => handleInput(field, 'name', e.target.value)}
              />
              <input
                placeholder={`成績（${units[fIndex]}）`}
                value={inputs[field]?.score || ''}
                onChange={e => handleInput(field, 'score', e.target.value)}
                type={field === '高音王' ? 'text' : 'number'}
                list={field === '高音王' ? 'pitches' : undefined}
              />
              <select
                value={inputs[field]?.team || ''}
                onChange={e => handleInput(field, 'team', e.target.value)}
              >
                <option value="">天惠幾班</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>天惠 {i + 1} 班</option>
                ))}
              </select>
            </div>
            <button onClick={() => handleSubmit(field)}>➕ 加入成績</button>

            <div>
              {(data[field] || []).map((entry, i) => (
                <div key={i}>
                  {['🥇','🥈','🥉','4️⃣','5️⃣'][i]} {entry.name} {entry.score} 天惠 {entry.team} 班
                </div>
              ))}
            </div>
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

      <button
        onClick={() => {
          const password = prompt("請輸入管理密碼：")
          if (password === "159357") {
            if (confirm("你確定要清除所有資料嗎？這個動作無法復原！")) {
              set(ref(database, 'scoreData'), {})
              alert("所有成績已初始化")
            }
          } else {
            alert("密碼錯誤，無法初始化")
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

      {/* 高音王輸入限制列表 */}
      <datalist id="pitches">
        {pitchOrder.map(p => <option key={p} value={p} />)}
      </datalist>
    </div>
  )
}
