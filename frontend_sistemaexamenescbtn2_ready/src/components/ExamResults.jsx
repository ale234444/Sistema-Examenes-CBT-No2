import React, { useEffect, useState } from 'react'
import api from '../services/api'
export default function ExamResults(){
  const [results,setResults]=useState([])
  useEffect(()=>{ (async()=>{ try{ const r=await api.get('/results'); setResults(r.data || []) }catch(e){console.error(e)} })() },[])
  return (
    <div>
      <h4 className="text-lg font-semibold mb-3">Resultados</h4>
      {results.length===0 ? <div className="text-sm text-gray-500">No hay resultados</div> : results.map(r=>(
        <div key={r.id} className="p-3 border rounded mb-2">
          <div className="font-semibold">{r.studentName || r.nombre || r.student}</div>
          <div className="text-sm text-gray-600">Exam: {r.examTitle || r.title}</div>
          <div className="text-sm text-gray-600">Score: {r.score}</div>
        </div>
      ))}
    </div>
  )
}
