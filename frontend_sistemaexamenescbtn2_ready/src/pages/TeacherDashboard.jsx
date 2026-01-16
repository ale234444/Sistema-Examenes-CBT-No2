import React, { useEffect, useState } from 'react'
import api from '../services/api'
import CreateExam from '../components/CreateExam'
import ExamResults from '../components/ExamResults'

export default function TeacherDashboard({ user, setUser }){
  const [exams,setExams]=useState([])
  const fetchExams=async()=>{ try{ const r=await api.get('/exams'); setExams(r.data || []) }catch(e){console.error(e)} }
  useEffect(()=>{ fetchExams() },[])
  const logout=()=>{ localStorage.removeItem('user'); localStorage.removeItem('token'); setUser(null); window.location='/' }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-indigo-600">Sistema de Exámenes CBT</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">Profesor: {user?.nombre}</div>
            <button onClick={logout} className="px-3 py-2 bg-red-500 text-white rounded">Salir</button>
          </div>
        </header>
        <main className="grid md:grid-cols-2 gap-6 mt-6">
          <section className="bg-white p-6 rounded shadow"><CreateExam onCreated={fetchExams}/></section>
          <section className="bg-white p-6 rounded shadow"><h3 className="text-xl font-semibold mb-4">Exámenes publicados</h3>{exams.map(e=>(<div key={e.id} className="border-b py-2"><div className="font-semibold">{e.title||e.titulo}</div><div className="text-sm text-gray-500">{e.description||e.descripcion}</div></div>))}<ExamResults/></section>
        </main>
      </div>
    </div>
  )
}
