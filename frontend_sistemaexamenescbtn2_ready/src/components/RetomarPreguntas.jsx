// src/components/RetomarPreguntas.jsx
import React, { useState, useEffect } from "react";
import { api } from "../Api";

const RetomarPreguntas = ({ examId, teacherId, onClose }) => {
    const [preguntas, setPreguntas] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Cargar preguntas disponibles
    const cargarPreguntasDisponibles = async () => {
        setLoading(true);
        setMessage('Cargando...');
        
        console.log("🔄 DEBUG - Iniciando carga de preguntas:", {
            examId,
            teacherId,
            url: `teacher/get_available_questions.php?exam_id=${examId}&teacher_id=${teacherId}`
        });

        try {
            const url = `teacher/get_available_questions.php?exam_id=${examId}&teacher_id=${teacherId}`;
            console.log("📡 DEBUG - URL completa:", url);
            
            const res = await api.get(url);
            console.log("✅ DEBUG - Respuesta recibida:", res);
            
            const data = res.data;
            console.log("📊 DEBUG - Datos parseados:", data);
            
            if (data.success) {
                setPreguntas(data.preguntas);
                setMessage(`Encontradas ${data.preguntas.length} preguntas disponibles`);
                console.log("🎯 DEBUG - Preguntas establecidas:", data.preguntas);
            } else {
                setMessage('Error al cargar preguntas: ' + data.message);
                console.error("❌ DEBUG - Error en respuesta:", data.message);
            }
        } catch (error) {
            console.error("💥 DEBUG - Error completo:", error);
            console.error("💥 DEBUG - Error response:", error.response);
            setMessage('Error: ' + (error.response?.data?.message || error.message || 'Error desconocido'));
        } finally {
            setLoading(false);
        }
    };

    // Seleccionar/deseleccionar pregunta
    const toggleQuestionSelection = (questionId) => {
        setSelectedQuestions(prev => 
            prev.includes(questionId) 
                ? prev.filter(id => id !== questionId)
                : [...prev, questionId]
        );
    };

    // Agregar preguntas seleccionadas al examen
    const agregarPreguntasAlExamen = async () => {
        if (selectedQuestions.length === 0) {
            setMessage('Selecciona al menos una pregunta');
            return;
        }

        setLoading(true);
        try {
            let successCount = 0;
            let errorCount = 0;

            for (const questionId of selectedQuestions) {
                const result = await api.post("teacher/retomar_pregunta.php", {
                    target_exam_id: examId,
                    source_question_id: questionId,
                });

                if (result.data.success) {
                    successCount++;
                } else {
                    errorCount++;
                }
            }

            setMessage(`✅ ${successCount} preguntas agregadas. ❌ ${errorCount} errores.`);
            
            // Recargar la lista
            if (successCount > 0) {
                cargarPreguntasDisponibles();
                setSelectedQuestions([]);
            }
        } catch (error) {
            setMessage('Error al agregar preguntas: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("🎬 DEBUG - Componente montado, examId:", examId, "teacherId:", teacherId);
        if (examId && teacherId) {
            cargarPreguntasDisponibles();
        } else {
            setMessage('Error: Faltan examId o teacherId');
            console.error("❌ DEBUG - Faltan parámetros:", { examId, teacherId });
        }
    }, [examId, teacherId]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">📥 Retomar Preguntas</h2>
                    <button onClick={onClose} className="text-white hover:text-gray-200 text-xl">✕</button>
                </div>

                {/* Mensajes */}
                {message && (
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
                        {message}
                    </div>
                )}

                {/* Contenido */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {loading ? (
                        <div className="text-center py-8">Cargando preguntas disponibles...</div>
                    ) : preguntas.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No hay preguntas disponibles para agregar a este examen
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {preguntas.map((pregunta) => (
                                <div key={pregunta.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedQuestions.includes(pregunta.id)}
                                            onChange={() => toggleQuestionSelection(pregunta.id)}
                                            className="mt-1"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <span className="font-medium text-gray-800">{pregunta.texto}</span>
                                                <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                                                    {pregunta.tipo} - ID: {pregunta.id}
                                                </span>
                                            </div>
                                            {pregunta.opciones && pregunta.opciones.length > 0 && (
                                                <div className="mt-2 text-sm text-gray-600">
                                                    <strong>Opciones:</strong> {pregunta.opciones.join(', ')}
                                                </div>
                                            )}
                                            {pregunta.imagen && (
                                                <img 
                                                    src={pregunta.imagen} 
                                                    alt="Pregunta" 
                                                    className="w-32 rounded-md mt-2 border"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-4 flex justify-between items-center">
                    <div>
                        {selectedQuestions.length > 0 && (
                            <span className="text-sm text-gray-600">
                                {selectedQuestions.length} pregunta(s) seleccionada(s)
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={agregarPreguntasAlExamen}
                            disabled={loading || selectedQuestions.length === 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {loading ? 'Agregando...' : `Agregar (${selectedQuestions.length})`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetomarPreguntas;