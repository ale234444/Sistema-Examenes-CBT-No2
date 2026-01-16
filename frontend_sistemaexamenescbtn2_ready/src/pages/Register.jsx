import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [username,setUsername]=useState('')
  const [matricula,setMatricula]=useState('')
  const [password,setPassword]=useState('')
  const [role,setRole]=useState('ROLE_STUDENT')
  const navigate = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    try{
      await api.post('/auth/register', { username, matricula, password, role })
      alert('Registrado. Inicia sesión.')
      navigate('/')
    }catch(e){ console.error(e); alert('Error registrando') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Registro</h2>
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full p-3 border rounded-lg" placeholder="Nombre" value={username} onChange={e=>setUsername(e.target.value)} />
          <input className="w-full p-3 border rounded-lg" placeholder="Matrícula" value={matricula} onChange={e=>setMatricula(e.target.value)} />
          <input className="w-full p-3 border rounded-lg" type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} />
          <select className="w-full p-3 border rounded-lg" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="ROLE_STUDENT">Alumno</option>
            <option value="ROLE_TEACHER">Docente</option>
          </select>
          <button className="w-full py-3 bg-indigo-600 text-white rounded-lg">Registrar</button>
        </form>
      </div>
    </div>
  )
}
