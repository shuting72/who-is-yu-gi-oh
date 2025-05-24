import styles from '../styles/display.module.css';
import { useEffect, useState } from 'react';

const stages = [
  "USB王", "跳高王", "擲筊王", "高音王",
  "海賊王", "下腰王", "準時王", "乾眼王",
  "色盲王", "錯王", "蟹堡王", "神射王",
  "搧大王", "守門王", "定格王", "反應王"
];

const icons = [
  "💾", "🔔", "🩴", "🎵",
  "🏴‍☠️", "📏", "⏰", "👁️",
  "🕶️", "❌", "🍔", "🎯",
  "🪭", "🥅", "🤖", "⚡"
];

const Display = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [data, setData] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("scoreboard");
    if (saved) setData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPageIndex((prev) => (prev + 1) % 9);
    }, pageIndex === 0 ? 15000 : 7000);
    return () => clearInterval(interval);
  }, [pageIndex]);

  if (pageIndex === 0) {
    return (
      <div className={styles.grid}>
        {stages.map((stage, index) => {
          const score = data[stage]?.[0] || { name: "--", score: "--" };
          const teamColor = getColorByTeam(data[stage]?.[0]?.team);
          return (
            <div key={stage} className={styles.card} style={{ backgroundColor: teamColor }}>
              <div className={styles.stageTitle}>{icons[index]} {stage}</div>
              <div className={styles.score}>成績：{score.score}</div>
              <div className={styles.champion}>👑 {score.name}</div>
            </div>
          );
        })}
      </div>
    );
  }

  const leftIndex = (pageIndex - 1) * 2;
  const rightIndex = leftIndex + 1;

  const renderBlock = (index) => {
    const stage = stages[index];
    const records = data[stage] || [];
    const unit = records.unit || getUnit(stage);

    return (
      <div key={stage} className={styles.block}>
        <div className={styles.stage}>{icons[index]} {stage}</div>
        {records.slice(0, 5).map((item, i) => (
          <div key={i} className={styles.entry}>
            {["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][i]} {item.name} - {item.score}{unit}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.carousel}>
      {renderBlock(leftIndex)}
      {rightIndex < stages.length && renderBlock(rightIndex)}
    </div>
  );
};

const getUnit = (name) => {
  const map = {
    "USB王": "次", "跳高王": "公分", "擲筊王": "次", "高音王": "音",
    "海賊王": "分", "下腰王": "公分", "準時王": "秒", "乾眼王": "秒",
    "色盲王": "題", "錯王": "題", "蟹堡王": "題", "神射王": "個",
    "搧大王": "個", "守門王": "顆", "定格王": "公分", "反應王": "毫秒"
  };
  return map[name] || "";
};

const getColorByTeam = (team) => {
  const colors = [
    "red", "orange", "yellow", "lime", "#006400", // 深綠
    "#00ccff", "#0000cc", "purple", "deeppink", "brown"
  ];
  return colors[parseInt(team) - 1] || "white";
};

export default Display;
