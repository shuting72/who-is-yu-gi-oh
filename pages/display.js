import styles from '../styles/display.module.css';
import { useEffect, useState } from 'react';

const stages = [
  { name: "USB王", icon: "💾", unit: "次" },
  { name: "跳高王", icon: "🔔", unit: "公分" },
  { name: "擲筊王", icon: "🩴", unit: "次" },
  { name: "高音王", icon: "🎵", unit: "音" },
  { name: "海賊王", icon: "🏴‍☠️", unit: "分" },
  { name: "下腰王", icon: "📏", unit: "公分" },
  { name: "準時王", icon: "⏰", unit: "秒" },
  { name: "乾眼王", icon: "👁️", unit: "秒" },
  { name: "色盲王", icon: "🕶️", unit: "題" },
  { name: "錯王", icon: "❌", unit: "題" },
  { name: "蟹堡王", icon: "🍔", unit: "題" },
  { name: "神射王", icon: "🎯", unit: "個" },
  { name: "搧大王", icon: "🪭", unit: "個" },
  { name: "守門王", icon: "🥅", unit: "顆" },
  { name: "定格王", icon: "🤖", unit: "公分" },
  { name: "反應王", icon: "⚡", unit: "毫秒" }
];

const Display = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [data, setData] = useState({});

  // 自動切換頁面
  useEffect(() => {
    const interval = setInterval(() => {
      setPageIndex((prev) => (prev + 1) % 9);
    }, pageIndex === 0 ? 15000 : 7000);
    return () => clearInterval(interval);
  }, [pageIndex]);

  // 從 localStorage 讀取資料
  useEffect(() => {
    const records = localStorage.getItem("records");
    if (!records) return;

    const parsed = JSON.parse(records);
    const grouped = {};
    parsed.forEach(r => {
      if (!grouped[r.name]) grouped[r.name] = [];
      grouped[r.name].push({
        name: r.holder,
        score: r.score,
        unit: r.unit,
        team: r.team
      });
    });

    // 依成績排序
    for (const k in grouped) {
      grouped[k] = grouped[k]
        .filter(r => r.score)
        .sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
    }

    setData(grouped);
  }, []);

  // 🎯 總表畫面（pageIndex = 0）
  if (pageIndex === 0) {
    return (
      <div className={styles.grid}>
        {stages.map((stage, index) => {
          const scores = data[stage.name] || [];
          const top = scores[0] || { name: "--", score: "--", team: "" };

          // 小隊顏色
          const colors = ["#fff", "red", "orange", "yellow", "#66ff66", "green", "#88f", "blue", "purple", "pink", "#774400"];
          const color = top.team ? colors[parseInt(top.team)] || "#fff" : "#fff";

          return (
            <div key={stage.name} className={styles.card} style={{ backgroundColor: color }}>
              <div className={styles.stageTitle}>{stage.icon} {stage.name}</div>
              <div className={styles.score}>成績：{top.score}{stage.unit}</div>
              <div className={styles.champion}>👑 {top.name}</div>
            </div>
          );
        })}
      </div>
    );
  }

  // 🎯 輪播畫面（每頁兩關）
  const leftIndex = (pageIndex - 1) * 2;
  const rightIndex = leftIndex + 1;

  const renderBlock = (index) => {
    const stage = stages[index];
    const records = data[stage.name] || [];

    return (
      <div key={stage.name} className={styles.block}>
        <div className={styles.stage}>{stage.icon} {stage.name}</div>
        {records.slice(0, 5).map((item, i) => (
          <div key={i} className={styles.entry}>
            {["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][i]} {item.name} - {item.score}{stage.unit}
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

export default Display;
