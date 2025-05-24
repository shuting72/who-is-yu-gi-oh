'use client'

import { useState, useEffect } from 'react'
import styles from '../styles/display.module.css'

const fields = [
  'USB王', '跳高王', '擲筊王', '高音王',
  '海賊王', '下腰王', '準時王', '乾眼王',
  '色盲王', '錯王', '蟹堡王', '神射王',
  '搧大王', '守門王', '定格王', '反應王',
]

const units = [
  '次', '公分', '次', '音',
  '分', '公分', '秒', '秒',
  '題', '題', '題', '個',
  '個', '顆', '公分', '毫秒'
]

export default function Home() {
  const [data, setData] = useState({})

  useEffect(() => {
    const stored = localStorage.getItem('scoreData')
    if (stored) setData(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem('scoreData', JSON.stringify(data))
    localStorage.setItem("scoreboard", JSON.stringify(data))  // ← 這行確保同步給投影畫面用
    localStorage.setItem("broadcast", Date.now())              // ← 這行確保畫面即時更新
  }, [data])

  const handleChange = (field, index, key, value) => {
    setData(prev => {
      const updated = { ...prev }
      updated[field] = updated[field] || Array(5).fill({ name: '', score: '', team: '' })
      updated[field][index] = {
        ...updated[field][index],
        [key]: value
      }
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
                <span>{['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][i]}</span>
                <input
                  placeholder="記錄保持人"
                  value={entry.name || ''}
                  onChange={e => handleChange(field, i, 'name', e.target.value)}
                  style={{ color: entry.name ? '#000' : '#aaa' }}
                />
                <input
                  placeholder={`成績（${units[fIndex]}）`}
                  value={entry.score || ''}
                  onChange={e => handleChange(field, i, 'score', e.target.value)}
                  style={{ color: entry.score ? '#000' : '#aaa' }}
                />
                <select
                  value={entry.team || ''}
                  onChange={e => handleChange(field, i, 'team', e.target.value)}
                  style={{ color: entry.team ? '#000' : '#aaa' }}
                >
                  <option value="">未選擇小隊</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={i + 1}>{`第 ${i + 1} 小隊`}</option>
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
          <div key={i}>第 {i + 1} 小隊：{p} 分</div>
        ))}
      </div>

      <button
        onClick={() => {
          if (confirm("你確定要清除所有資料嗎？這個動作無法復原！")) {
            localStorage.clear();
            location.reload();
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
