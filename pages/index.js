// ✅ 控場頁面 index.js
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

const sortLogic = [
  'asc', 'desc', 'desc', 'note',
  'desc', 'asc', 'asc', 'desc',
  'desc', 'desc', 'desc', 'desc',
  'desc', 'desc', 'asc', 'asc'
]

const noteOrder = [
  'A0','B0','C1','D1','E1','F1','G1','A1','B1','C2','D2','E2','F2','G2','A2','B2','C3','D3','E3','F3','G3','A3','B3','C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5','B5','C6','D6','E6','F6','G6','A6','B6','C7','D7','E7','F7','G7','A7','B7','C8'
]

export default function Home() {
  const [data, setData] = useState({})
  const [pw, setPw] = useState('')
  const [showPW, setShowPW] = useState(false)

  useEffect(() => {
    const dbRef = ref(database, 'scoreData')
    return onValue(dbRef, (snapshot) => {
      const value = snapshot.val()
      if (value) setData(value)
    })
  }, [])

  const sortEntries = (entries, fieldIndex) => {
    const logic = sortLogic[fieldIndex]
    return entries
      .filter(e => e.name && e.score && e.team)
      .reduce((acc, cur) => {
        const existing = acc.find(e => e.name === cur.name)
        if (!existing) acc.push(cur)
        else {
          const compare = compareScores(existing.score, cur.score, logic)
          if (compare > 0) acc.splice(acc.indexOf(existing), 1, cur)
        }
        return acc
      }, [])
      .sort((a, b) => compareScores(a.score, b.score, logic))
      .slice(0, 5)
  }

  const compareScores = (a, b, logic) => {
    if (logic === 'note') {
      return noteOrder.indexOf(a) - noteOrder.indexOf(b)
    } else {
      const aNum = parseFloat(a)
      const bNum = parseFloat(b)
      return logic === 'asc' ? aNum - bNum : bNum - aNum
    }
  }

  const handleChange = (field, index, key, value) => {
    setData(prev => {
      const updated = { ...prev }
      updated[field] = updated[field] || []
      updated[field][index] = {
        ...updated[field][index],
        [key]: value
      }

      const filtered = updated[field].filter(e => e.name || e.score || e.team)
      const sorted = sortEntries(filtered, fields.indexOf(field))
      set(ref(database, `scoreData/${field}`), sorted)

      updated[field] = sorted
      return updated
    })
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
            {(data[field] || Array(5).fill({})).map((entry, i) => (
              <div key={i} className={styles.row}>
                <span>{['🥇','🥈','🥉','4️⃣','5️⃣'][i]}</span>
                <input
                  placeholder="記錄保持人"
                  value={entry.name || ''}
                  onChange={e => handleChange(field, i, 'name', e.target.value)}
                  style={{ color: entry.name ? '#000' : '#aaa' }}
                />
                <input
                  type={sortLogic[fIndex] === 'note' ? 'text' : 'number'}
                  placeholder={sortLogic[fIndex] === 'note' ? 'A0 ~ C8' : `成績（${units[fIndex]}）`}
                  value={entry.score || ''}
                  onChange={e => handleChange(field, i, 'score', e.target.value)}
                  style={{ color: entry.score ? '#000' : '#aaa' }}
                />
                <select
                  value={entry.team || ''}
                  onChange={e => handleChange(field, i, 'team', e.target.value)}
                  style={{ color: entry.team ? '#000' : '#aaa' }}
                >
                  <option value="">未選擇班級</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={i + 1}>{`天惠 ${i + 1} 班`}</option>
                  ))}
                </select>
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

      {!showPW ? (
        <div style={{ marginTop: '30px' }}>
          <input
            placeholder="輸入密碼才能初始化"
            value={pw}
            type="password"
            onChange={e => setPw(e.target.value)}
            style={{ padding: '8px', fontSize: '16px' }}
          />
          <button onClick={() => setShowPW(pw === '159357')} style={{ marginLeft: '10px' }}>確認</button>
        </div>
      ) : (
        <button
          onClick={() => {
            if (confirm("你確定要清除所有資料嗎？這個動作無法復原！")) {
              set(ref(database, 'scoreData'), {})
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
        >🔄 初始化所有成績</button>
      )}
    </div>
  )
}
