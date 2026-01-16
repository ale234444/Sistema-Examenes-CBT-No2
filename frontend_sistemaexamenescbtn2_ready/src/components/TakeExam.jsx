import React, { useState } from 'react'
import api from '../services/api'

export default function TakeExam({ exam, studentId }){
  const [open,setOpen]=useState(false)
  const [answers,setAnswers]=useState({})
  const submit=async()=>{ if(!confirm('Enviar examen?')) return; try{ const payload={ examId: exam.id, studentId, answersJson: JSON.stringify(answers), examTitle: exam.title||exam.titulo, score:0 }; await api.post('/results', payload); alert('Enviado'); setOpen(false) }catch(e){ console.error(e); alert('Error enviando') } }
  return (
    <div>
      {!open ? <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={()=>setOpen(true)}>Contestar</button> : (
        <div className="space-y-2">
          <input className="w-full p-2 border rounded" placeholder="Respuesta 1" onChange={e=>setAnswers(a=>({...a,p1:e.target.value}))} />
          <input className="w-full p-2 border rounded" placeholder="Respuesta 2" onChange={e=>setAnswers(a=>({...a,p2:e.target.value}))} />
          <div className="flex gap-2"><button className="px-3 py-2 bg-green-600 text-white rounded" onClick={submit}>Enviar</button><button className="px-3 py-2 bg-gray-300 rounded" onClick={()=>setOpen(false)}>Cancelar</button></div>
        </div>
      )}
    </div>
  )
}
