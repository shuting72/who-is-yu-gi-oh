// /pages/index.js
'use client'

import { useEffect, useState } from 'react'
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
  '秒', '公分', '次', 'A0 ~ C8',
  '分', '公分', '秒', '秒',
  '題', '題', '題', '杯',
  '杯', '顆', '公分', '毫秒'
]

const sortLogic = {
  'USB王': 'asc', '跳高王': 'desc', '擲筊王': 'desc',
  '高音王': 'pitch', '海賊王': 'desc', '下腰王': 'asc',
  '準時王': 'asc', '乾眼王': 'desc', '色盲王': 'desc',
  '錯王': 'desc', '蟹堡王': 'desc', '神射王': 'desc',
  '搧大王': 'desc', '守門王': 'desc', '定格王': 'asc',
  '反應王': 'asc'
}

const pitchOrder = [
  'A0', 'B0', 'C1', 'D1', 'E1', 'F1', 'G1', 'A1', 'B1',
  'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2', 'C3', 'D3',
  'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4',
  'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5',
  'B5', 'C6', 'D6', 'E6', 'F6', 'G6', 'A6', 'B6', 'C7',
  'D7', 'E7', 'F7', 'G7', 'A7', 'B7', 'C8'
]

export default function Home() {
  const [data, setData] = useState({})
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const dbRef = ref(database, 'scoreData')
    return onValue(dbRef, (snapshot) => {
      const value = snapshot.val()
      if (value) setData(value)
    })
  }, [])

  const handleSingleSubmit = (field, entry) => {
    const list = [...(data[field] || [])]
    const existing = list.filter(e => e.name !== entry.name)
    existing.push({ ...entry, timestamp: Date.now() })

    let sorted = [...existing]
    const logic = sortLogic[field]
    if (logic === 'asc') {
      sorted.sort((a, b) => parseFloat(a.score) - parseFloat(b.score))
    } else if (logic === 'desc') {
      sorted.sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
    } else if (logic === 'pitch') {
      sorted.sort((a, b) => pitchOrder.indexOf(a.score) - pitchOrder.indexOf(b.score))
    }

    sorted = sorted.slice(0, 5)
    set(ref(database, `scoreData/${field}`), sorted)
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
        {fields.map((field, fIndex) => (
          <div key={field} className={styles.card}>
            <strong>{field}</strong>
            <div className={styles.row}>
              <input
                placeholder="記錄保持人"
                onChange={e => setData(d => ({ ...d, [field + '_name']: e.target.value }))}
                style={{ color: data[field + '_name'] ? '#000' : '#aaa' }}
              />
              <input
                placeholder={`成績（${units[fIndex]}）`}
                onChange={e => setData(d => ({ ...d, [field + '_score']: e.target.value }))}
                type={sortLogic[field] === 'pitch' ? 'text' : 'number'}
                style={{ color: data[field + '_score'] ? '#000' : '#aaa' }}
              />
              <select
                onChange={e => setData(d => ({ ...d, [field + '_team']: e.target.value }))}
                style={{ color: data[field + '_team'] ? '#000' : '#aaa' }}>
                <option value="">未選擇班級</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>{`天惠 ${i + 1} 班`}</option>
                ))}
              </select>
              <button onClick={() => handleSingleSubmit(field, {
                name: data[field + '_name'],
                score: data[field + '_score'],
                team: data[field + '_team']
              })}>
                ➕ 加入成績
              </button>
            </div>

            {(data[field] || []).map((entry, i) => (
              <div key={i} className={styles.row}>
                <span>{['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][i]}</span>
                <div>{entry.name || '-'}</div>
                <div>{entry.score || '-'}</div>
                <div>{entry.team ? `天惠 ${entry.team} 班` : '-'}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <h3 style={{ color: 'white' }}>總積分</h3>
      <div className={styles.points}>
        {teamPoints.map((p, i) => (
          <div key={i}>天惠 {i + 1} 班：{p} 分</div>
        ))}
      </div>

      <hr style={{ marginTop: '20px' }} />
      <button
        onClick={() => setShowPassword(!showPassword)}
        style={{ color: 'white', marginBottom: '10px' }}>
        {showPassword ? '🔒 隱藏初始化' : '🔓 顯示初始化按鈕'}
      </button>

      {showPassword && (
        <div style={{ marginTop: '10px' }}>
          <input
            placeholder="請輸入密碼"
            type="password"
            value={passwordInput}
            onChange={e => setPasswordInput(e.target.value)}
          />
          <button
            onClick={() => {
              if (passwordInput === '1234') {
                if (confirm("你確定要清除所有資料嗎？這個動作無法復原！")) {
                  set(ref(database, 'scoreData'), {})
                }
              } else {
                alert('密碼錯誤！')
              }
            }}
            style={{
              backgroundColor: 'red',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              marginLeft: '10px',
              cursor: 'pointer'
            }}>
            🔄 初始化所有成績
          </button>
        </div>
      )}
    </div>
  )
}
