import { useEffect, useState } from 'react'
import styles from '../styles/display.module.css'

const games = [
  'USB王', '跳高王', '擲筊王', '高音王',
  '海賊王', '下腰王', '準時王', '乾眼王',
  '色盲王', '錯王', '蟹堡王', '神射王',
  '搧大王', '守門王', '定格王', '反應王'
]

const icons = ['💾', '🔔', '🩴', '🎵', '🏴‍☠️', '📏', '⏰', '👁️', '🕶️', '❌', '🍔', '🏹', '🌂', '🧱', '🤖', '⚡']

const dummyRankings = games.map((name, i) => ({
  name,
  icon: icons[i],
  scores: [
    { name: '小明', score: '50次' },
    { name: '阿花', score: '48次' },
    { name: '小志', score: '46次' },
    { name: '阿土', score: '44次' },
    { name: '大寶', score: '42次' }
  ]
}))

export default function DisplayPage() {
  const [pageIndex, setPageIndex] = useState(0)
  const pages = []

  for (let i = 0; i < dummyRankings.length; i += 2) {
    pages.push(dummyRankings.slice(i, i + 2))
  }

  useEffect(() => {
    const total = pages.length + 1
    const interval = setInterval(() => {
      setPageIndex(prev => (prev + 1) % total)
    }, pageIndex === 0 ? 15000 : 7000)
    return () => clearInterval(interval)
  }, [pageIndex])

  return (
    <div className={styles.container}>
      {pageIndex === 0 ? (
        <div className={styles.grid}>
          {dummyRankings.map((game, i) => (
            <div className={styles.gridItem} key={i}>
              <div className={styles.title}>{game.icon} {game.name}</div>
              <div className={styles.score}>成績：--</div>
              <div className={styles.champion}>👑 --</div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.pageWrapper}>
          {pages[pageIndex - 1].map((game, i) => (
            <div className={styles.rankBlock} key={i}>
              <div className={styles.rankTitle}>{game.icon} {game.name}</div>
              <ol className={styles.rankList}>
                {game.scores.map((s, idx) => (
                  <li key={idx}>
                    <span className={styles.rankIcon}>{['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][idx]}</span>
                    <span className={styles.rankText}>{s.name} - {s.score}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
