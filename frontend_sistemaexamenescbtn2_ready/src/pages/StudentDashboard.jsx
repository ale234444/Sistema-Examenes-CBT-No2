import React, { useEffect, useState } from 'react'
import api from '../services/api'
import TakeExam from '../components/TakeExam'

export default function StudentDashboard({ user, setUser }){
  const [exams,setExams]=useState([])
  useEffect(()=>{ (async()=>{ try{ const r=await api.get('/exams'); setExams(r.data || []) }catch(e){console.error(e)} })() },[])
  const logout = ()=>{ localStorage.removeItem('user'); localStorage.removeItem('token'); setUser(null); window.location='/' }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-indigo-600">Sistema de Exámenes CBT</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">Alumno: {user?.nombre}</div>
            <button onClick={logout} className="px-3 py-2 bg-red-500 text-white rounded">Salir</button>
          </div>
        </header>
        <main className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Exámenes disponibles</h2>
          <div className="grid gap-4">
            {exams.length===0 ? <div className="p-4 bg-white rounded shadow">No hay exámenes</div> : exams.map(e=>(
              <div key={e.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
                <div><div className="font-semibold">{e.title||e.titulo}</div><div className="text-sm text-gray-500">{e.description||e.descripcion}</div></div>
                <TakeExam exam={e} studentId={user?.id} />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
