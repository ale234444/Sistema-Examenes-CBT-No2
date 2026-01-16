import React, { useState } from 'react'
import api from '../services/api'

export default function CreateExam({ user, onCreated }) {
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [semestre, setSemestre] = useState("")
  const [grupo, setGrupo] = useState("")
  const [timeLimit, setTimeLimit] = useState("")

  const submit = async (e) => {
    e.preventDefault()
    if (!titulo || !descripcion || !semestre || !grupo) {
      alert("Completa título, descripción, semestre y grupo.")
      return
    }

    // grupo llega como "1|Administracion"
    const [grupoNumber, career] = grupo.split("|")

    const payload = {
      titulo,
      descripcion,
      teacher_id: user.id,
      grade_id: parseInt(semestre),
      group_id: parseInt(grupoNumber),
      career: career,
      time_limit: parseInt(timeLimit) || null,
      enabled: 1,
      publish_date: new Date().toISOString().slice(0, 19).replace("T", " ")
    }

    try {
      const res = await api.post("teacher/create_exam.php", payload)
      alert(res.data?.message ?? "Examen creado")
      setTitulo("")
      setDescripcion("")
      setSemestre("")
      setGrupo("")
      setTimeLimit("")
      if (onCreated) onCreated()
    } catch (err) {
      console.error(err)
      alert("Error al crear examen.")
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 p-4 border rounded-lg bg-white shadow">
      <h2 className="text-xl font-bold">📝 Crear Nuevo Examen</h2>
      <input placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} className="w-full p-2 border rounded" />
      <textarea placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full p-2 border rounded" />
      <select value={semestre} onChange={e => setSemestre(e.target.value)} className="w-full p-2 border rounded">
        <option value="">Seleccionar semestre</option>
        {[1,2,3,4,5,6].map(s => <option key={s} value={s}>{s}° Semestre</option>)}
      </select>
      <select value={grupo} onChange={e => setGrupo(e.target.value)} className="w-full p-2 border rounded">
        <option value="">Seleccionar grupo</option>
        <option value="1|Administracion">1 de Administración</option>
        <option value="2|Administracion">2 de Administración</option>
        <option value="3|Administracion">3 de Administración</option>
        <option value="1|Informatica">1 de Informática</option>
        <option value="2|Informatica">2 de Informática</option>
        <option value="3|Informatica">3 de Informática</option>
      </select>
      <input type="number" placeholder="Tiempo límite (minutos)" value={timeLimit} onChange={e => setTimeLimit(e.target.value)} className="w-full p-2 border rounded" />
      <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold">Crear Examen</button>
    </form>
  )
}
