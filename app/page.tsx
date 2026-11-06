"use client";
import { useState } from "react";

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [jd, setJd] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    const res = await fetch("/api/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, jobDescription: jd })
    });
    const json = await res.json();
    setData(json);
    console.log("CAPTURED SCORE:", json.score); // <- you can take action here
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Resume ATS Scorer</h1>
      <textarea placeholder="Paste Resume" value={resumeText} onChange={e=>setResumeText(e.target.value)} style={{ width:"100%", height:120 }} />
      <textarea placeholder="Paste Job Description" value={jd} onChange={e=>setJd(e.target.value)} style={{ width:"100%", height:120, marginTop:10 }} />
      <button onClick={analyze} disabled={loading} style={{ marginTop:10, padding:"10px 20px" }}>{loading?"Analyzing...":"Analyze"}</button>

      {data && (
        <div style={{ marginTop:20, border:"1px solid #ddd", padding:20 }}>
          <h2 style={{ fontSize:40, background:"#eee", padding:"4px 8px", margin:4 }}>Score: {data.score}/100</h2>
          <h3>Missing Keywords:</h3>
          <div>{data.missing_keywords?.map((k:string)=><span key={k} style={{ background:"#eee", padding:"4px 8px", margin:4, display:"inline-block" }}>{k}</span>)}</div>
          <h3>Suggestions:</h3>
          <ul>{data.suggestions?.map((s:string,i:number)=><li key={i}>{s}</li>)}</ul>
          <h3>Fixed Bullets (Click to copy):</h3>
          <ul>{data.fixed_bullets?.map((b:string,i:number)=><li key={i} onClick={()=>navigator.clipboard.writeText(b)} style={{ cursor:"pointer" }}>{b} 📋</li>)}</ul>
        </div>
      )}
    </div>
  );
}
