// pages/display.js
import { useEffect, useState } from 'react';
import styles from '../styles/display.module.css';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const stageList = [
  'USB王', '跳高王', '擲筊王', '高音王', '海賊王', '下腰王', '準時王', '乾眼王',
  '色盲王', '錯王', '蟹堡王', '神射王', '搧大王', '守門王', '定格王', '反應王'
];

const icons = ['💿', '🦘', '🎲', '🎵', '🏴‍☠️', '🔪', '⏰', '👀', '🧠', '❌', '🍔', '🏹', '🪭', '🥅', '📸', '⚡'];

const pageDelay = [15000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000]; // ms

export default function Display() {
  const [scores, setScores] = useState({});
  const [page, setPage] = useState(0);
  const [visibleRanks, setVisibleRanks] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (page === 0) {
      setVisibleRanks({});
    } else {
      const leftStage = stageList[(page - 1) * 2];
      const rightStage = stageList[(page - 1) * 2 + 1];
      setVisibleRanks({ [leftStage]: 0, [rightStage]: 0 });

      const interval = setInterval(() => {
        setVisibleRanks(prev => {
          const nextLeft = (prev[leftStage] ?? 0) + 1;
          const nextRight = (prev[rightStage] ?? 0) + 1;
          if (nextLeft > 5 && nextRight > 5) {
            clearInterval(interval);
          }
          return {
            [leftStage]: Math.min(5, nextLeft),
            [rightStage]: Math.min(5, nextRight)
          };
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [page]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage((prev) => (prev + 1) % 9);
    }, pageDelay[page]);
    return () => clearTimeout(timeout);
  }, [page]);

  const fetchData = async () => {
    const result = {};
    const querySnapshot = await getDocs(collection(db, 'scores'));
    querySnapshot.forEach((doc) => {
      result[doc.id] = doc.data().ranks || [];
    });
    setScores(result);
  };

  if (page === 0) {
    return (
      <div className={styles.container}>
        {stageList.map((stage, i) => (
          <div className={styles.stageBox} key={stage}>
            <div className={styles.stageTitle}>
              {icons[i]} {stage}
            </div>
            <div className={styles.stageScore}>
              成績：{scores[stage]?.[0]?.score ?? '－'}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const leftIndex = (page - 1) * 2;
  const rightIndex = (page - 1) * 2 + 1;

  const renderRank = (stage, count) => (
    <div className={styles.stageBlock}>
      <div className={styles.rankTitle}>{icons[stageList.indexOf(stage)]} {stage}</div>
      {scores[stage]?.slice(0, count).map((item, idx) => (
        <div className={styles.rankRow} key={idx}>
          <span className={styles.rankIcon}>
            {['🥇','🥈','🥉','4','5'][idx]}
          </span>
          <span className={styles.rankName}>{item.name}</span>
          <span className={styles.rankScore}>{item.score}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.slidePage}>
      {renderRank(stageList[leftIndex], visibleRanks[stageList[leftIndex]] ?? 0)}
      {renderRank(stageList[rightIndex], visibleRanks[stageList[rightIndex]] ?? 0)}
    </div>
  );
}
