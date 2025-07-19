import { useEffect, useState } from 'react';
import styles from '../styles/display.module.css';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const stages = [
  'USB王', '跳高王', '擲筊王', '高音王',
  '海賊王', '下腰王', '準時王', '乾眼王',
  '色盲王', '錯王', '蟹堡王', '神射王',
  '搧大王', '守門王', '定格王', '反應王'
];

const icons = [
  '💾', '🔔', '🥟', '🎤',
  '🏴‍☠️', '🧘', '⏰', '👁️',
  '🎨', '❌', '🍔', '🏹',
  '🪭', '⚽', '📷', '⚡'
];

export default function Display() {
  const [data, setData] = useState({});
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'scores'));
      const newData = {};
      snapshot.forEach(doc => {
        newData[doc.id] = doc.data().ranking || [];
      });
      setData(newData);
    };

    fetchData();
    const interval = setInterval(() => {
      setPage(p => (p + 1) % 9); // 1 總表 + 8 頁排行榜
      fetchData();
    }, page === 0 ? 15000 : 7000);

    return () => clearInterval(interval);
  }, [page]);

  if (page === 0) {
    return (
      <div className={styles.grid16}>
        {stages.map((stage, i) => {
          const rank = data[stage]?.[0];
          const team = rank?.team || 0;
          return (
            <div key={stage} className={`${styles.block} ${teamColor(team)}`}>
              <div className={styles.icon}>{icons[i]}</div>
              <div>{stage}</div>
              <div className={styles.name}>成績：{rank?.score || '-'}</div>
              <div className={styles.name}>{rank?.name || ''}</div>
            </div>
          );
        })}
      </div>
    );
  }

  const stage1 = stages[(page - 1) * 2];
  const stage2 = stages[(page - 1) * 2 + 1];

  return (
    <div className={styles.carousel}>
      {[stage1, stage2].map((stage, index) => (
        <div key={index} className={styles.panel}>
          <div className={styles.title}>{icons[stages.indexOf(stage)]} {stage}</div>
          <div className={styles.rankings}>
            {data[stage]?.slice(0, 5).map((r, i) => (
              <div
                key={i}
                className={`${styles.row} ${styles[`rank${i + 1}`]}`}
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                <span>{rankIcon(i)}</span>
                <span className={styles.rankName}>{r.name}</span>
                <span className={styles.rankScore}>{r.score}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function teamColor(team) {
  return ['red', 'orange', 'yellow', 'lime', 'green', 'cyan', 'blue', 'purple', 'pink', 'brown'][team - 1] || '';
}

function rankIcon(i) {
  return ['🥇', '🥈', '🥉', '4', '5'][i] || '';
}
