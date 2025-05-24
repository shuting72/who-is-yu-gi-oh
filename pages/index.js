import { useEffect, useState } from 'react'
const defaultRecords = [
  { name:"USB王",unit:"次"},{ name:"跳高王",unit:"公分"},{ name:"擲筊王",unit:"次"},
  { name:"高音王",unit:"音"},{ name:"海賊王",unit:"分"},{ name:"下腰王",unit:"公分"},
  { name:"準時王",unit:"秒"},{ name:"乾眼王",unit:"秒"},{ name:"色盲王",unit:"題"},
  { name:"錯王",unit:"題"},{ name:"蟹堡王",unit:"題"},{ name:"神射王",unit:"個"},
  { name:"搧大王",unit:"個"},{ name:"守門王",unit:"顆"},{ name:"定格王",unit:"公分"},
  { name:"反應王",unit:"毫秒"},
]

export default function Control() {
  const [records,setRecords] = useState([])
  useEffect(()=>{
    const st = localStorage.getItem('records')
    if(st) setRecords(JSON.parse(st))
    else setRecords(defaultRecords.map(r=>({...r,holder:'',score:'',team:''})))
  },[])
  const update=(i,f,v)=>{
    const copy = [...records]
    copy[i][f]=v
    setRecords(copy)
    localStorage.setItem('records',JSON.stringify(copy))
    localStorage.setItem('broadcast',Date.now())
  }
  // 計算總積分
  const teamPoints = Array(10).fill(0)
  records.forEach(r=>{
    if(!r.team||!r.score) return
    const t = Number(r.team)-1
    // 假設 r.score 用 number 排名好了
    const n = Number(r.score)
    // 前五分別給 5,4,3,2,1
    if(n>0){
      // 這裡簡化：直接把前五名順序固定放 input 名次檢查後再換
      teamPoints[t] += 1
    }
  })

  return (
    <div style={{background:'#111',color:'#fff',minHeight:'100vh',padding:'20px'}}>
      <h2 style={{fontSize:'28px',color:'#fff'}}>控場介面</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'32px'}}>
        {records.map((r,i)=>(
          <div key={i} style={{marginBottom:'24px',borderBottom:'1px solid #555',paddingBottom:'16px'}}>
            <div style={{fontWeight:'bold',marginBottom:'8px',fontSize:'18px'}}>{r.name}</div>
            {[...Array(5)].map((_,j)=>(
              <div key={j} style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}>
                <span style={{width:'24px'}}>{['🥇','🥈','🥉','4️⃣','5️⃣'][j]}</span>
                <input
                  value={j===0?r.score: r[`score${j}`]||''}
                  onChange={e=> update(i,j===0?'score':`score${j}`,e.target.value)}
                  placeholder="成績"
                  style={{flex:1,padding:'6px'}}
                />
                <span style={{minWidth:'40px'}}>{r.unit}</span>
                <select
                  value={r.team}
                  onChange={e=> update(i,'team',e.target.value)}
                  style={{padding:'6px'}}
                >
                  <option value="">未選擇</option>
                  {[...Array(10)].map((_,t)=>(
                    <option key={t} value={t+1}>第 {t+1} 小隊</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{marginTop:'32px',borderTop:'2px solid #444',paddingTop:'16px'}}>
        <h3 style={{fontSize:'20px'}}>🏆 各隊總積分</h3>
        {teamPoints.map((p,i)=>(
          <div key={i} style={{margin:'4px 0'}}>第 {i+1} 小隊：{p} 分</div>
        ))}
      </div>
    </div>
  )
}
