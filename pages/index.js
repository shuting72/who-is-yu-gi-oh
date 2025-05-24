import { useEffect, useState } from "react";

const stages = [
  "USB王","跳高王","擲筊王","高音王",
  "海賊王","下腰王","準時王","乾眼王",
  "色盲王","錯王","蟹堡王","神射王",
  "搧大王","守門王","定格王","反應王"
];
const medals = ["🥇","🥈","🥉","4️⃣","5️⃣"];
const points = [5,4,3,2,1];

export default function Control() {
  const [recs, setRecs] = useState([]);
  const [total, setTotal] = useState(Array(10).fill(0));

  useEffect(()=>{
    const saved = JSON.parse(localStorage.getItem("records")||"[]");
    if(saved.length) setRecs(saved);
    else {
      setRecs(stages.map(n=>({
        name:n, unit:"",
        ranks:Array(5).fill({name:"",score:"",team:""})
      })));
    }
  },[]);

  // 保存 & 計分
  const save = u=>{
    setRecs(u);
    localStorage.setItem("records",JSON.stringify(u));
    localStorage.setItem("broadcast", Date.now());
    // 重新算總分
    const t = Array(10).fill(0);
    u.forEach(s=>{
      s.ranks.forEach((r,i)=>{
        if(r.team) t[r.team-1] += points[i];
      });
    });
    setTotal(t);
  };

  const update=(si,ri,f,v)=>{
    const cp = [...recs];
    cp[si]={...cp[si], ranks:cp[si].ranks.map((r,i)=>i===ri?{...r,[f]:v}:r)};
    save(cp);
  };

  return (
    <div style={{background:"#111",color:"#fff",padding:24}}>
      <h2 style={{color:"#fff"}}>控場介面</h2>
      <div style={{
        display:"grid",
        gridTemplateColumns:"1fr 1fr",
        gap:48
      }}>
        {stages.map((s,i)=>(
          <div key={i}>
            <h3 style={{color:"#fff"}}>{s}</h3>
            {recs[i]?.ranks.map((r,ri)=>(
              <div key={ri} style={{display:"flex",gap:8,marginBottom:8}}>
                <div style={{width:24}}>{medals[ri]}</div>
                <input
                  placeholder="記錄保持人"
                  value={r.name}
                  onChange={e=>update(i,ri,"name",e.target.value)}
                  style={{flex:1, padding:6, color:"#000"}}
                />
                <input
                  placeholder={`成績（${recs[i].unit||''}）`}
                  value={r.score}
                  onChange={e=>update(i,ri,"score",e.target.value)}
                  style={{width:120,padding:6, color:"#000"}}
                />
                <select
                  value={r.team}
                  onChange={e=>update(i,ri,"team",e.target.value)}
                  style={{width:120,padding:6,color:"#000"}}
                >
                  <option value="">未選擇小隊</option>
                  {[...Array(10)].map((_,t)=>
                    <option key={t} value={t+1}>第 {t+1} 小隊</option>
                  )}
                </select>
              </div>
            ))}
            <hr style={{borderColor:"#333",margin:"16px 0"}}/>
          </div>
        ))}
      </div>
      <div style={{marginTop:24}}>
        <h3 style={{color:"#fff"}}>🏆 各隊總積分</h3>
        {total.map((p,i)=>(
          <div key={i} style={{margin:4}}>
            第 {i+1} 小隊：{p} 分
          </div>
        ))}
      </div>
    </div>
  );
}
