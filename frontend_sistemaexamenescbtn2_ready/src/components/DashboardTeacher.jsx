// src/components/DashboardTeacher.jsx
import React, { useEffect, useState } from "react";
import { api } from "../Api";
import Swal from "sweetalert2";

export default function DashboardTeacher({ user, onLogout }) {

const [showExamsModal, setShowExamsModal] = useState(false);
const [showQuestionsModal, setShowQuestionsModal] = useState(false);
const [teacherExams, setTeacherExams] = useState([]);
const [examQuestions, setExamQuestions] = useState([]);

  // --- Exámenes y selección ---
  const [exams, setExams] = useState([]);
  
  const [selectedExamId, setSelectedExamId] = useState(null);

  // --- Crear examen ---
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [semestre, setSemestre] = useState("");
  const [grupo, setGrupo] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
const [showExamView, setShowExamView] = useState(false);


  // --- Preguntas (por examen) ---
  const [questionsByExam, setQuestionsByExam] = useState({});

  // --- Formulario de pregunta (crear / editar) ---
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [texto, setTexto] = useState("");
  const [tipo, setTipo] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [colA, setColA] = useState([""]);
  const [colB, setColB] = useState([""]);


const [questions, setQuestions] = useState([]);

  
  const [imagen, setImagen] = useState(null);

  // --- Calificaciones de alumnos ---
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [mostrarCalificaciones, setMostrarCalificaciones] = useState(false);
 // --- Retomar examen (mostrar preguntas existentes) ---
const [selectedExam, setSelectedExam] = useState(null);

const [modalExamenes, setModalExamenes] = useState(false);
const [modalPreguntas, setModalPreguntas] = useState(false);

const [listaExamenes, setListaExamenes] = useState([]);
const [listaPreguntas, setListaPreguntas] = useState([]);


const [showRetomarPanel, setShowRetomarPanel] = useState(false);
const [preguntasDelExamen, setPreguntasDelExamen] = useState([]);
const [examIdSeleccionado, setExamIdSeleccionado] = useState(null);

const [examSourceId, setExamSourceId] = useState("");

// Examen destino (al que se agregarán preguntas)
const [targetExamId, setTargetExamId] = useState(null);

// Examen fuente (del cual se traen preguntas)
const [sourceExamId, setSourceExamId] = useState(null);

// --- NUEVOS ESTADOS PARA RETOMAR EXAMEN ---
const [showRetomarModal, setShowRetomarModal] = useState(false);
const [examenesFuente, setExamenesFuente] = useState([]);
const [examenFuenteSeleccionado, setExamenFuenteSeleccionado] = useState(null);
const [preguntasExamenFuente, setPreguntasExamenFuente] = useState([]);
const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState([]);

// --- NUEVO ESTADO PARA RETOMAR EXAMEN SIMPLE ---
const [showRetomarExamenModal, setShowRetomarExamenModal] = useState(false);
const [examenesParaRetomar, setExamenesParaRetomar] = useState([]);
const [examenRetomarSeleccionado, setExamenRetomarSeleccionado] = useState(null);
const [preguntasParaRetomar, setPreguntasParaRetomar] = useState([]);


// ---------- HELPERS ----------
// Normaliza una pregunta recibida desde cualquier endpoint a la forma que usa el UI
const normalizeQuestion = (raw) => {
  // Algunos endpoints devuelven campos distintos: "opciones", "options", "metadata", "metadata"
  const q = {
    id: Number(raw.id),
    texto: raw.texto ?? raw.text ?? raw.question_text ?? "",
    tipo: raw.tipo ?? raw.type ?? "",
    // campos para mostrar (si existen)
    options: raw.opciones ?? raw.options ?? (raw.metadata && raw.metadata.opciones) ?? [],
    correct_answer: raw.correcta ?? raw.correct_answer ?? raw.correct_answer ?? raw.correcta ?? raw.correct_answer ?? raw.correctAnswer ?? null,
    metadata: raw.metadata ? (typeof raw.metadata === "string" ? JSON.parse(raw.metadata || "{}") : raw.metadata) : (raw.metadata ?? {}),
    imagen: raw.image_url ?? raw.imagen ?? raw.imagen_url ?? null,
    // si el registro viene desde exam_questions puede traer question_order
    question_order: raw.question_order !== undefined ? Number(raw.question_order) : null,
    // mantener original
    raw
  };
  return q;
};



// obtener todas las calificaciones de este docente
const fetchResults = async (examId = 0) => {
  try {
    const url = examId
      ? `teacher/get_results.php?teacher_id=${user.id}&exam_id=${examId}`
      : `teacher/get_results.php?teacher_id=${user.id}`;
    const res = await api.get(url);
    setResults(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error("Error al obtener calificaciones:", err);
  }
};



const addQuestionToExam = async (targetExamId, sourceQuestionId) => {
  try {
    const res = await api.post("teacher/retomar_pregunta.php", {
      target_exam_id: targetExamId,
      source_question_id: sourceQuestionId,
    });

    if (res.data.success) {
      notify("✔ Pregunta retomada con éxito");
    } else {
      notify("❌ " + res.data.message);
    }
  } catch (error) {
    console.log("Error retomando pregunta:", error);
    notify("❌ Error al retomar");
  }
};

const cargarPreguntas = async (examId) => {
  setExamIdSeleccionado(examId);

  try {
    const res = await api.get(
      `teacher/get_exam_questions.php?exam_id=${examId}`
    );

    const data = Array.isArray(res.data.questions)
      ? res.data.questions
      : [];

    setPreguntasDelExamen(data);

  } catch (error) {
    console.error("Error cargando preguntas:", error);
    setPreguntasDelExamen([]);
  }
};
// 🔹 Cargar preguntas del examen seleccionado
const fetchExamQuestions = async (examId) => {
  if (!examId) {
    setExamQuestions([]);
    return;
  }

  try {
    // preguntas enlazadas via exam_questions
    const resExamQuestions = await api.get(`teacher/get_exam_questions.php?exam_id=${examId}`);
    const examQuestionsRaw = Array.isArray(resExamQuestions.data?.questions) ? resExamQuestions.data.questions : [];

    // preguntas creadas directamente con exam_id en questions
    const resCreated = await api.get(`teacher/get_questions.php?exam_id=${examId}`);
    const createdRaw = Array.isArray(resCreated.data?.questions) ? resCreated.data.questions : [];

    // normalizar si hace falta y convertir ids a Number
    const examQs = examQuestionsRaw.map(q => ({ ...q, id: Number(q.id), question_order: q.question_order ? Number(q.question_order) : null }));
    const createdQs = createdRaw.map(q => ({ ...q, id: Number(q.id) }));

    const mapExam = new Map();
    examQs.forEach(q => mapExam.set(Number(q.id), q));

    // ordenar por question_order
    examQs.sort((a, b) => {
      const A = (a.question_order === null || isNaN(a.question_order)) ? 999999 : a.question_order;
      const B = (b.question_order === null || isNaN(b.question_order)) ? 999999 : b.question_order;
      return A - B;
    });

    const merged = [...examQs];
    createdQs.forEach(cq => {
      if (!mapExam.has(Number(cq.id))) merged.push(cq);
    });

    setExamQuestions(merged);
    setQuestionsByExam(prev => ({ ...prev, [examId]: merged }));
  } catch (err) {
    console.error(err);
    setExamQuestions([]);
    setQuestionsByExam(prev => ({ ...prev, [examId]: [] }));
  }
};


// 🔹 Cargar preguntas disponibles para retomar
const fetchAvailableQuestions = async () => {
  try {
    const res = await api.get("teacher/get_all_questions.php");
    const data = Array.isArray(res.data.questions) ? res.data.questions : [];
    setAvailableQuestions(data);
  } catch (error) {
    console.error("Error cargando preguntas disponibles:", error);
    setAvailableQuestions([]);
  }
};

// 🔹 Hook para cargar al iniciar o cambiar de examen
useEffect(() => {
  if (selectedExamId) fetchExamQuestions(selectedExamId);
  fetchAvailableQuestions();
}, [selectedExamId]);



 const notify = (msg, type = "info") => {
  Swal.fire({
    title:
      type === "success"
        ? "✅ Éxito"
        : type === "error"
        ? "❌ Error"
        : type === "warning"
        ? "⚠️ Atención"
        : "ℹ️ Mensaje",
    text: msg,
    icon: type,
    confirmButtonColor: "#2563eb",
    confirmButtonText: "Aceptar",
    background: "#fff",
  });
};

  const fetchExams = async () => {
    try {
      const res = await api.get(`teacher/get_exams.php?teacher_id=${user.id}`);
      setExams(Array.isArray(res.data) ? res.data : res.data.exams ?? []);
    } catch (err) {
      console.error("Error al obtener exámenes:", err);
      notify("Error al obtener exámenes (ver consola).");
    }
  };

 useEffect(() => {
  fetchExams();
  fetchResults();
}, []);

const handleCreateExam = async () => {
  if (!titulo.trim() || !descripcion.trim() || !semestre || !grupo) {
    notify("Completa título, descripción, semestre y grupo");
    return;
  }

  // EXTRAER NÚMERO DE GRUPO Y CARRERA DESDE EL TEXTO
  // Ejemplo: "1 de Administración"
  const regex = /^(\d+)\s+de\s+(.*)$/;
  const match = grupo.match(regex);

  if (!match) {
    notify("Formato de grupo inválido");
    return;
  }

  const group_number = parseInt(match[1]);  // 1, 2, 3...
  const career = match[2];                  // "Administración" o "Informática"

  try {
    const payload = {
      titulo,
      descripcion,
      teacher_id: user.id,
      grade_id: semestre,
      group_id: group_number,   // SOLO NÚMERO
      career: career,           // CARRERA REAL
      time_limit: timeLimit,
      enabled: 1,
      publish_date: new Date().toISOString().slice(0, 19).replace("T", " ")
    };

    const res = await api.post("teacher/create_exam.php", payload);
    const message = res.data?.message ?? "Examen creado";
    notify(message);

    // LIMPIAR FORM
    setTitulo("");
    setDescripcion("");
    setSemestre("");
    setGrupo("");
    setTimeLimit("");

    fetchExams();
  } catch (err) {
    console.error("Error al crear examen:", err);
    notify("Error al crear examen (ver consola).");
  }
};

const toggleExamStatus = async (examId, newStatus) => {
  try {
    const response = await api.post("teacher/toggle_exam_status.php", {
      exam_id: examId,
      is_enabled: newStatus,
    });

    if (response.data.success) {
      alert("Estado actualizado correctamente");
      fetchExams();  // volver a cargar la lista
    } else {
      alert("No se pudo actualizar el estado");
    }

  } catch (error) {
    console.error("Error al actualizar:", error);
    alert("No se pudo conectar con el servidor.");
  }
};



  const handleDeleteExam = async (id) => {
  const result = await Swal.fire({
    title: "¿Eliminar este examen?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;
    try {
      const res = await api.post("teacher/delete_exam.php", { id });
      notify(res.data?.message ?? "Examen eliminado");
      setQuestionsByExam((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      if (selectedExamId === id) setSelectedExamId(null);
      fetchExams();
    } catch (err) {
      console.error("Error al eliminar examen:", err);
      notify("Error al eliminar examen.");
    }
  };

  const handleEditExamPrompt = async (exam) => {
    const nuevoTitulo = prompt("Nuevo título:", exam.titulo || "");
    if (nuevoTitulo === null) return;
    const nuevaDesc = prompt("Nueva descripción:", exam.descripcion || "");
    if (nuevaDesc === null) return;
    const nuevoSem = prompt("Semestre (1-6):", exam.grade_id ?? "");
    if (nuevoSem === null) return;
    const nuevoGrp = prompt("Grupo (ej. 1A):", exam.group_id ?? "");
    if (nuevoGrp === null) return;

    try {
      const res = await api.post("teacher/update_exam.php", {
        id: exam.id,
        nombre: nuevoTitulo,
        descripcion: nuevaDesc,
        semestre: nuevoSem,
        grupo: nuevoGrp,
      });
      notify(res.data?.message ?? "Examen actualizado");
      fetchExams();
    } catch (err) {
      console.error("Error editar examen:", err);
      notify("Error al editar examen.");
    }
  };

  const fetchQuestions = async (examId) => {
  if (!examId) return;
  try {
    const res = await api.get(`teacher/get_questions.php?exam_id=${examId}`);

    let q = [];
    if (Array.isArray(res.data)) {
      q = res.data;
    } else if (Array.isArray(res.data.questions)) {
      q = res.data.questions;
    } else if (res.data.questions && typeof res.data.questions === "object") {
      q = Object.values(res.data.questions);
    } else {
      q = [];
    }

    setQuestionsByExam((prev) => ({ ...prev, [examId]: q }));
  } catch (err) {
    console.error("Error al cargar preguntas:", err);
    notify("Error al cargar preguntas.");
  }
};

  const addOption = () => setOptions((prev) => [...prev, ""]);
  const setOptionValue = (idx, v) =>
    setOptions((prev) => {
      const c = [...prev];
      c[idx] = v;
      return c;
    });
  const removeOption = (idx) =>
    setOptions((prev) => prev.filter((_, i) => i !== idx));

  const addColA = () => setColA((prev) => [...prev, ""]);
  const addColB = () => setColB((prev) => [...prev, ""]);
  const setColAValue = (i, v) =>
    setColA((prev) => {
      const c = [...prev];
      c[i] = v;
      return c;
    });
  const setColBValue = (i, v) =>
    setColB((prev) => {
      const c = [...prev];
      c[i] = v;
      return c;
    });

  const startEditQuestion = (q) => {
    setEditingQuestionId(q.id);
    setTexto(q.texto || "");
    setTipo(q.tipo || "");
    setImagen(null);
    let meta = {};
    try {
      meta = q.metadata
        ? typeof q.metadata === "string"
          ? JSON.parse(q.metadata)
          : q.metadata
        : {};
    } catch (e) {
      meta = {};
    }
    if (q.tipo === "multiple" || q.tipo === "cerrada") {
      setOptions(meta.opciones ?? ["", ""]);
      setCorrectAnswer(q.correct_answer ?? null);
    } else if (q.tipo === "falso_verdadero") {
      setOptions(["Verdadero", "Falso"]);
      setCorrectAnswer(q.correct_answer ?? null);
    } else if (q.tipo === "relacion_columnas") {
      setColA(meta.columnaA ?? [""]);
      setColB(meta.columnaB ?? [""]);
      setCorrectAnswer(null);
    } else {
      setOptions(["", ""]);
      setCorrectAnswer(q.correct_answer ?? null);
    }
  };

  const saveQuestion = async () => {
    if (!selectedExamId) {
      notify("Selecciona un examen primero");
      return;
    }
    if (!texto.trim() || !tipo) {
      notify("Completa texto y tipo");
      return;
    }

    let metadata = {};
    if (tipo === "multiple" || tipo === "cerrada") {
      metadata.opciones = options.filter((opt) => opt.trim() !== "");
    } else if (tipo === "falso_verdadero") {
      metadata.opciones = ["Verdadero", "Falso"];
    } else if (tipo === "relacion_columnas") {
      metadata.columnaA = colA.filter((x) => x.trim() !== "");
      metadata.columnaB = colB.filter((x) => x.trim() !== "");
    }

    const formData = new FormData();
    formData.append("exam_id", selectedExamId);
    formData.append("texto", texto.trim());
    formData.append("tipo", tipo);
    formData.append("metadata", JSON.stringify(metadata));
    formData.append(
      "correct_answer",
      Array.isArray(correctAnswer)
        ? JSON.stringify(correctAnswer)
        : correctAnswer ?? ""
    );
    if (imagen) formData.append("imagen", imagen);

    try {
      let res;
      if (editingQuestionId) {
        formData.append("id", editingQuestionId);
        res = await api.post("teacher/update_question.php", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        } else {
        res = await api.post("teacher/add_question.php", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          });
        }

      notify(res.data?.message ?? "Pregunta guardada");
      fetchQuestions(selectedExamId);
      setTexto("");
      setTipo("");
      setOptions(["", ""]);
      setCorrectAnswer(null);
      setColA([""]);
      setColB([""]);
      setImagen(null);
      setEditingQuestionId(null);
    } catch (err) {
      console.error("Error al guardar pregunta:", err);
      notify("❌ Error al guardar pregunta");
    }
  };

  const deleteQuestion = async (id) => {
  const result = await Swal.fire({
    title: "¿Eliminar pregunta?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  try {
    const res = await api.post("teacher/delete_question.php", { id });
    notify(res.data?.message ?? "Pregunta eliminada", "success");
    fetchQuestions(selectedExamId);
  } catch (err) {
    console.error("Error eliminar pregunta:", err);
    notify("Error al eliminar pregunta", "error");
  }
};

const loadExams = async () => {
  try {
    const res = await api.get(
      `teacher/get_exams.php?teacher_id=${user.id}`
    );

    setExams(Array.isArray(res.data) ? res.data : []);

    setShowExamsModal(true);
  } catch (error) {
    console.error("ERROR cargando exámenes:", error);
  }
};

const loadQuestions = async (examId) => {
  try {
    const res = await api.get(
      `teacher/get_questions.php?exam_id=${examId}`
    );

    const preguntas = Array.isArray(res.data.questions)
      ? res.data.questions
      : [];

    setQuestions(preguntas);
    setShowQuestionsModal(true);
  } catch (error) {
    console.error("ERROR cargando preguntas:", error);
    setQuestions([]);
  }
};

const retomarExamen = async (examId) => {
  try {
    const res = await api.get(`/teacher/get_exam_questions.php?exam_id=${examId}`);

    if (!res.data.questions) {
      alert("El backend no regresó ninguna pregunta");
      return;
    }

    setExamQuestions(res.data.questions);
    setSelectedExam(examId);
    setModalPreguntas(true);
  } catch (error) {
    console.error("Error al cargar preguntas:", error);
    alert("❌ No se pudieron obtener las preguntas");
  }
};



const loadExamQuestions = async (examId) => {
  const res = await api.get(`teacher/get_exam_questions.php?exam_id=${examId}`);
  setQuestions(res.data.questions);
};

const retomarPregunta = async (pregunta) => {
  try {
    const res = await api.post("teacher/retomar_pregunta.php", {
      id_pregunta: pregunta.id,        // 👈 ESTE DATO ES OBLIGATORIO
      id_examen: pregunta.id_examen,   // 👈 ESTE DATO TAMBIÉN ES OBLIGATORIO
      id_docente: user.id              // 👈 EL DOCENTE
    });

    console.log("RESPUESTA RETOMAR:", res.data);
  } catch (error) {
    console.error("Error al retomar:", error);
  }
};







const abrirPreguntas = async (examId) => {
  setExamenFuenteSeleccionado(examId);  // 👈 Ahora sí correcto (EXAMEN FUENTE)

  try {
    const res = await api.get(`/teacher/get_exam_questions.php?exam_id=${examId}`);

    setExamQuestions(Array.isArray(res.data.questions) ? res.data.questions : []);

    setModalPreguntas(true);
  } catch (error) {
    console.error("Error al obtener preguntas:", error);
    alert("No se pudieron obtener las preguntas");
  }
};



// --- FUNCIONES SIMPLIFICADAS PARA RETOMAR EXAMEN ---
const abrirRetomarExamen = async () => {
  if (!selectedExamId) {
    notify("Primero selecciona un examen al que agregar preguntas", "warning");
    return;
  }
  
  try {
    const res = await api.get(`teacher/get_exams.php?teacher_id=${user.id}`);
    const examenesFiltrados = Array.isArray(res.data) 
      ? res.data.filter(exam => exam.id !== selectedExamId)
      : [];
    
    setExamenesFuente(examenesFiltrados);
    setShowRetomarModal(true);
    setPreguntasSeleccionadas([]);
    setPreguntasExamenFuente([]);
    setExamenFuenteSeleccionado(null);
  } catch (error) {
    console.error("Error al cargar exámenes:", error);
    notify("Error al cargar la lista de exámenes", "error");
  }
};

const cargarPreguntasExamenFuente = async (examId) => {
  try {
    const res = await api.get(`teacher/get_exam_questions.php?exam_id=${examId}`);
    const preguntas = Array.isArray(res.data.questions) ? res.data.questions : [];
    
    setPreguntasExamenFuente(preguntas);
    setExamenFuenteSeleccionado(examId);
    setPreguntasSeleccionadas([]);
  } catch (error) {
    console.error("Error al cargar preguntas:", error);
    notify("Error al cargar las preguntas del examen", "error");
  }
};

const toggleSeleccionPregunta = (preguntaId) => {
  setPreguntasSeleccionadas(prev => {
    if (prev.includes(preguntaId)) {
      return prev.filter(id => id !== preguntaId);
    } else {
      return [...prev, preguntaId];
    }
  });
};

const seleccionarTodasPreguntas = () => {
  const todosIds = preguntasExamenFuente.map(p => p.id);
  setPreguntasSeleccionadas(todosIds);
};

const deseleccionarTodasPreguntas = () => {
  setPreguntasSeleccionadas([]);
};

// FUNCIÓN CORREGIDA PARA GUARDAR SELECCIONES
const guardarSelecciones = () => {
  if (preguntasSeleccionadas.length === 0) {
    notify("No hay preguntas seleccionadas para guardar", "warning");
    return;
  }
  
  const seleccionesGuardadas = {
    examId: selectedExamId,
    examenFuenteId: examenFuenteSeleccionado,
    preguntas: preguntasSeleccionadas,
    timestamp: new Date().toISOString(),
    cantidad: preguntasSeleccionadas.length,
    examenFuenteTitulo: examenesFuente.find(e => e.id === examenFuenteSeleccionado)?.titulo || "Sin título"
  };
  
  localStorage.setItem('seleccionesPreguntas', JSON.stringify(seleccionesGuardadas));
  notify(`✅ Se guardaron ${preguntasSeleccionadas.length} pregunta(s)`, "success");
};

// VERSIÓN SUPER SIMPLE - SOLO PARA PROBAR
// FUNCIÓN CORREGIDA PARA CARGAR SELECCIONES
// FUNCIÓN MEJORADA - CARGAR SELECCIONES CON AUTO-SELECCIÓN
// VERSIÓN SIMPLE - IGNORA EL EXAMEN FUENTE
const cargarSeleccionesGuardadas = () => {
  try {
    const seleccionesGuardadas = localStorage.getItem('seleccionesPreguntas');
    
    if (!seleccionesGuardadas) {
      notify("No hay selecciones guardadas", "info");
      return;
    }
    
    const selecciones = JSON.parse(seleccionesGuardadas);
    
    // Cargar las selecciones sin importar el examen fuente
    setPreguntasSeleccionadas(selecciones.preguntas);
    notify(`✅ Se cargaron ${selecciones.preguntas.length} pregunta(s) guardadas`, "success");
    
  } catch (error) {
    notify("Error al cargar selecciones", "error");
  }
};




// FUNCIÓN MEJORADA EN REACT
// FUNCIÓN MEJORADA PARA RETOMAR PREGUNTAS
const retomarPreguntasSeleccionadas = async () => {
  if (preguntasSeleccionadas.length === 0)
    return notify("No hay preguntas seleccionadas", "warning");

  if (!selectedExamId)
    return notify("No hay examen destino", "error");

  let successCount = 0;

  for (const preguntaId of preguntasSeleccionadas) {
    try {
      const response = await api.post("teacher/retomar_pregunta.php", {
        target_exam_id: Number(selectedExamId),
        source_question_id: Number(preguntaId)
      });

      if (response.data?.success) successCount++;

    } catch (e) {
      console.error("Error:", e);
    }
  }

  // refrescar preguntas del examen destino (una sola vez)
  await fetchExamQuestions(selectedExamId);

  if (successCount > 0) {
    notify(`✅ Se agregaron ${successCount} pregunta(s) al examen`, "success");
    setShowRetomarModal(false);
  } else {
    notify("No se añadieron preguntas (pueden ya existir)", "info");
  }
};



// --- NUEVAS FUNCIONES PARA RETOMAR EXAMEN SIMPLE ---
const abrirRetomarExamenModal = async () => {
  try {
    const res = await api.get(`teacher/get_exams.php?teacher_id=${user.id}`);
    setExamenesParaRetomar(Array.isArray(res.data) ? res.data : []);
    setShowRetomarExamenModal(true);
    setExamenRetomarSeleccionado(null);
    setPreguntasParaRetomar([]);
  } catch (error) {
    console.error("Error al cargar exámenes:", error);
    notify("Error al cargar la lista de exámenes", "error");
  }
};

const cargarPreguntasParaRetomar = async (examIdOrigen) => {
  // prevenir origen == destino
  if (Number(examIdOrigen) === Number(selectedExamId)) {
    notify("❌ No puedes usar el mismo examen como origen y destino", "error");
    return;
  }

  try {
    const res = await api.get(`teacher/get_exam_questions.php?exam_id=${examIdOrigen}`);
    const preguntas = Array.isArray(res.data.questions) ? res.data.questions : [];
    setPreguntasParaRetomar(preguntas);
    setExamenRetomarSeleccionado(Number(examIdOrigen));
    setShowRetomarExamenModal(true); // o setShowRetomarModal según tu UI
  } catch (err) {
    console.error(err);
    notify("Error cargando preguntas del examen origen", "error");
  }
};


// Función para obtener las preguntas de un examen y actualizar el estado
const fetchPreguntasDelExamen = async (examId) => {
  try {
    const resp = await api.get(`/teacher/get_exam_questions.php?exam_id=${examId}`);
    if (resp.data?.success) {
      setListaPreguntas(resp.data.questions); // ✅ Aquí actualizas la lista que se muestra
    } else {
      setListaPreguntas([]); // Limpiar lista si hay error
      notify("❌ No se pudieron cargar las preguntas del examen", "error");
    }
  } catch (error) {
    console.error("Error al obtener preguntas del examen:", error);
    setListaPreguntas([]);
    notify("❌ Error de conexión al obtener preguntas", "error");
  }
};



// Función principal para retomar la pregunta
const retomarPreguntaSeleccionada = async (pregunta) => {
  if (!pregunta?.id) return notify("Pregunta inválida", "error");
  if (!selectedExamId) return notify("Selecciona primero un examen destino", "error");
  if (!examenRetomarSeleccionado) return notify("Selecciona un examen origen", "error");

  try {
    // pasar números explícitos
    const resp = await api.post("teacher/retomar_pregunta.php", {
      source_question_id: Number(pregunta.id),
      target_exam_id: Number(selectedExamId)
    });

    console.log("retomar respuesta:", resp.data);

    if (resp.data?.success) {
      notify(`✅ Pregunta "${pregunta.texto}" agregada al examen destino`, "success");
      // refrescar UI del examen destino
      await fetchExamQuestions(Number(selectedExamId));
      // opcional: refrescar modal origen para marcar ya agregada
      const preguntasOrigen = preguntasParaRetomar.map(p => ({...p}));
      setPreguntasParaRetomar(preguntasOrigen);
    } else {
      notify(resp.data?.message || "Error al retomar", "error");
      // si backend dice "ya estaba", refresca igualmente
      if (resp.data?.message?.toLowerCase().includes("ya")) {
        await fetchExamQuestions(Number(selectedExamId));
      }
    }
  } catch (err) {
    console.error(err);
    notify("Error en servidor al retomar pregunta", "error");
  }
};






  const [activeNav, setActiveNav] = useState("exams");

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <div className="flex min-h-screen">
        <aside className="w-72 bg-white border-r border-gray-200 shadow-sm hidden md:flex flex-col">
          <div className="px-6 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                CBT
              </div>
              <div>
                <div className="text-sm font-semibold">CBT No.2</div>
                <div className="text-xs text-gray-500">San Felipe del Progreso</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              <li></li>
            </ul>
          </nav>

          <div className="px-6 py-4 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-2">Docente</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{user.username}</div>
                <div className="text-xs text-gray-400">ID: {user.id}</div>
              </div>
              <button
                onClick={onLogout}
                className="bg-slate-200 border border-slate-400 text-slate-800 px-3 py-1 rounded-md hover:bg-slate-300 hover:shadow-sm transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 md:pl-8">
            <div className="flex items-center gap-4">
              <div className="md:hidden">
                <button
                  onClick={() => {}}
                  className="p-2 rounded-md bg-gray-100"
                  aria-label="menu"
                >
                  <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none">
                    <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div>
                <div className="text-sm text-gray-500">CBT No.2 San Felipe del Progreso</div>
                <div className="text-lg font-semibold text-gray-800 hidden sm:block">Panel docente</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 hidden sm:block">Bienvenido, <span className="font-medium text-gray-800">{user.username}</span></div>
              <button
                onClick={onLogout}
                className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-md hover:shadow-sm"
              >
                Cerrar sesión
              </button>
            </div>
          </header>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">📝 Crear Nuevo Examen</h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    {/* Título del Examen */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título del Examen
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        placeholder="Ingresa el título del examen"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                      />
                    </div>

                    {/* Descripción */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none"
                        placeholder="Describe el objetivo del examen"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        rows="3"
                      />
                    </div>

                    {/* Semestre y Grupo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Semestre & Grupo
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                            value={semestre}
                            onChange={(e) => setSemestre(e.target.value)}
                          >
                            <option value="">Seleccionar</option>
                            {[1,2,3,4,5,6].map(s => (
                              <option key={s} value={s}>{s}° Semestre</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                            value={grupo}
                            onChange={(e) => setGrupo(e.target.value)}
                          >
                            <option value="">Seleccionar</option>
                            <option value="1 de Administración">1 de Administración</option>
                            <option value="2 de Administración">2 de Administración</option>
                            <option value="3 de Administración">3 de Administración</option>
                            <option value="1 de Informática">1 de Informática</option>
                            <option value="2 de Informática">2 de Informática</option>
                            <option value="3 de Informática">3 de Informática</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Tiempo Límite */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tiempo Límite (minutos)
                      </label>
                      <input
                        type="number"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(e.target.value)}
                        placeholder="Ejemplo: 45"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                      />
                    </div>

                    {/* Botón Crear Examen */}
                    <div className="pt-2">
                      <button
                        onClick={handleCreateExam}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md text-sm transition duration-200"
                      >
                        Crear Examen
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mt-4 text-sm text-gray-600">
                  <strong>Consejos</strong>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Completa título y descripción claras.</li>
                    <li>Asigna semestre y grupo correctos.</li>
                    <li>Las preguntas pueden llevar imagen o metadata.</li>
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                  
             <div className="flex justify-between items-center mb-5">
  <h3 className="text-lg font-semibold text-gray-800">📚 Lista de exámenes</h3>

  <select
    className="border border-gray-300 px-3 py-2 rounded-md text-sm"
    value={selectedExamId}
    onChange={(e) => setSelectedExamId(e.target.value)}
  >
    <option value="">Selecciona un examen</option>
    {exams.map((ex) => (
      <option key={ex.id} value={ex.id}>
        {ex.titulo}
      </option>
    ))}
  </select>

  <div className="flex gap-2">
    {!showResults ? (
      <button
        onClick={() => {
          if (!showResults) fetchResults();
          setShowResults(true);
        }}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
      >
        📊 Ver calificaciones
      </button>
    ) : (
      <button
        onClick={() => setShowResults(false)}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
      >
        ❌ Cerrar calificaciones
      </button>
    )}
  </div>
</div>

{selectedExam && (
  <div className="mt-8 bg-white rounded-xl shadow-sm p-5 border border-gray-100">
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-lg font-semibold text-gray-800">
        🧩 Preguntas del examen seleccionado
      </h3>
      <button
        onClick={() => {
          setSelectedExam(null);
          setSelectedExamId(null);
          setExamQuestions([]);
        }}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow"
      >
        ❌ Cerrar
      </button>
    </div>

    {examQuestions.length === 0 ? (
      <p className="text-gray-500">Este examen no tiene preguntas registradas.</p>
    ) : (
      <ul className="space-y-3">
        {examQuestions.map((q, i) => (
          <li
            key={i}
            className="p-3 border border-gray-200 rounded-lg bg-gray-50 shadow-sm"
          >
            <p className="font-medium">
              {i + 1}. {q.texto}
            </p>

            {q.imagen && (
              <img
                src={q.imagen}
                className="w-32 rounded-md mt-2"
                alt="Pregunta"
              />
            )}

            {q.options && q.options.length > 0 && (
              <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                {q.options.map((opt, idx) => (
                  <li key={idx}>{opt}</li>
                ))}
              </ul>
            )}

            {q.tipo === "falso_verdadero" && (
              <p className="text-sm text-gray-600 mt-1">
                Opciones: Verdadero / Falso
              </p>
            )}

            {q.tipo === "relacion_columnas" && (
              <div className="mt-2 text-sm">
                <strong>Relación:</strong>
                {q.colA && q.colA.length > 0 && (
                  <ul className="mt-1">
                    {q.colA.map((a, idx) => (
                      <li key={idx}>
                        {a} ↔ {q.colB[idx]}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <p className="text-sm text-green-600 mt-2">
              ✅ Correcta: {q.correct_answer}
            </p>
<button
  onClick={() => {
    setSelectedExamId(selectedExam.id);  // 👈 GUARDAR EXAMEN DESTINO
    abrirPreguntas(ex.id);               // 👈 CARGAR EXAMEN FUENTE
    setShowRetomarModal(true);           // 👈 ABRIR MODAL
  }}
  className="px-4 py-2 bg-yellow-600 text-white rounded"
>
  Retomar examen
</button>


          </li>
        ))}
      </ul>
    )}
  </div>
)}

{showResults && (
  <div className="mt-10 bg-white rounded-xl shadow-sm p-5 border border-gray-100">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold text-gray-800">📊 Calificaciones de alumnos</h3>
      <div className="flex gap-2">
        <button
  onClick={() => fetchResults(selectedExamId)}
  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md shadow transition"
>
  🔄 Actualizar
</button>

        <button
          onClick={() => setShowResults(false)}
          className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md shadow transition"
        >
          ❌ Cerrar
        </button>
      </div>
    </div>

    {results.length === 0 ? (
      <p className="text-gray-500">Aún no hay calificaciones registradas.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Alumno</th>
              <th className="border px-3 py-2 text-left">Examen</th>
              <th className="border px-3 py-2 text-center">Calificación</th>
              <th className="border px-3 py-2 text-center">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{r.student_name || r.alumno || "—"}</td>
                <td className="border px-3 py-2">{r.exam_title || r.examen || "—"}</td>
                <td className="border px-3 py-2 text-center font-semibold">
                  {r.score ?? r.calificacion ?? "—"}
                </td>
                <td className="border px-3 py-2 text-center text-gray-500">
                  {r.date ?? r.fecha ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
  )}
                  <div className="mt-4 space-y-4">
                    {exams.length === 0 ? (
                      <div className="text-gray-600 p-4 rounded-md bg-gray-50">No hay exámenes.</div>
                    ) : (
                      exams.map((exam) => (
                        <div key={exam.id} className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition">
                          {/* Encabezado del examen */}
                          <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                                  {String((exam.titulo || exam.nombre || "E").slice(0,2)).toUpperCase()}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-800 text-base">{exam.titulo || exam.nombre}</h4>
                                  <p className="text-sm text-gray-600">{exam.descripcion || exam.materia || ""}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500 font-medium">Semestre {exam.grade_id ?? exam.semestre}</p>
                                <p className="text-xs text-gray-500">Grupo {exam.group_id ?? exam.grupo}</p>
                              </div>
                            </div>
                          </div>

                          {/* Botones de acción */}
                          <div className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              <button
                                onClick={() => {
                                  if (selectedExamId === exam.id) {
                                    setSelectedExamId(null);
                                    setQuestions([]); 
                                  } else {
                                    setSelectedExamId(exam.id);
                                    fetchQuestions(exam.id);
                                  }
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition flex items-center justify-center gap-1"
                              >
                                <span>📄</span>
                                {selectedExamId === exam.id ? "Ocultar" : "Ver preguntas"}
                              </button>

                              <button
                                onClick={abrirRetomarExamenModal}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm transition flex items-center justify-center gap-1"
                              >
                                <span>📥</span>
                                Retomar Examen
                              </button>

                              <button
                                onClick={() =>
                                  toggleExamStatus(
                                    exam.id,
                                    exam.is_enabled === 1 ? 0 : 1
                                  )
                                }
                                className={
                                  exam.is_enabled === 1
                                    ? "bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm transition flex items-center justify-center gap-1"
                                    : "bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm transition flex items-center justify-center gap-1"
                                }
                              >
                                <span>{exam.is_enabled === 1 ? "🔒" : "🔓"}</span>
                                {exam.is_enabled === 1 ? "Deshabilitar" : "Habilitar"}
                              </button>

                              <button
                                onClick={() => handleDeleteExam(exam.id)}
                                className="bg-red-700 hover:bg-red-800 text-white px-3 py-2 rounded-md text-sm transition flex items-center justify-center gap-1"
                              >
                                <span>🗑️</span>
                                Eliminar
                              </button>
                            </div>
                          </div>

                          {/* Sección de preguntas (si está seleccionado) */}
                          {selectedExamId === exam.id && (
                            <div className="border-t border-gray-200 bg-gray-50 p-4">
                              <h4 className="text-sm font-semibold text-gray-700 mb-3">➕ Agregar / editar pregunta</h4>

                              <div className="space-y-3 max-w-3xl">
                                <input
                                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                                  placeholder="Texto de la pregunta"
                                  value={texto}
                                  onChange={(e) => setTexto(e.target.value)}
                                />

                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    setImagen(e.target.files[0]);
                                  }}
                                  className="text-sm"
                                />
                                {imagen && <p className="text-sm text-green-700">📷 Imagen seleccionada: {imagen.name}</p>}

                                <select
                                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                                  value={tipo}
                                  onChange={(e) => {
                                    setTipo(e.target.value);
                                    setOptions(["", ""]);
                                    setCorrectAnswer(null);
                                  }}
                                >
                                  <option value="">Selecciona tipo</option>
                                  <option value="falso_verdadero">Falso / Verdadero</option>
                                  <option value="multiple">Opción múltiple (una correcta)</option>
                                  <option value="cerrada">Pregunta cerrada (una correcta)</option>
                                  <option value="reactivo">Reactivo / texto corto</option>
                                  <option value="relacion_columnas">Relación de columnas</option>
                                </select>

                                {["multiple", "cerrada"].includes(tipo) && (
                                  <div>
                                    <div className="text-sm text-gray-600 mb-2">Opciones (marca la correcta con radio):</div>
                                    {options.map((opt, i) => (
                                      <div key={i} className="flex gap-2 items-center mb-2">
                                        <input
                                          className="flex-1 border border-gray-200 rounded-md px-2 py-1 text-sm"
                                          value={opt}
                                          onChange={(e) =>
                                            setOptionValue(i, e.target.value)
                                          }
                                          placeholder={`Opción ${i + 1}`}
                                        />
                 
                                        <input
                                          type="radio"
                                          name={`correct-${exam.id}`}
                                          checked={correctAnswer === opt}
                                          onChange={() => setCorrectAnswer(opt)}
                                        />
                                        <button
                                          onClick={() => removeOption(i)}
                                          className="text-sm text-red-600 px-2 py-1"
                                        >
                                          Eliminar
                                        </button>
                                      </div>
                                    ))}
                                    <button onClick={addOption} className="text-sm text-blue-600">+ Agregar opción</button>
                                  </div>
                                )}

                                {tipo === "falso_verdadero" && (
                                  <div>
                                    <div className="mb-2 text-sm">Selecciona la respuesta correcta:</div>
                                    <label className="mr-4 text-sm">
                                      <input
                                        type="radio"
                                        name={`fv-${exam.id}`}
                                        checked={correctAnswer === "Verdadero"}
                                        onChange={() => setCorrectAnswer("Verdadero")}
                                        className="mr-1"
                                      />
                                      Verdadero
                                    </label>
                                    <label className="text-sm">
                                      <input
                                        type="radio"
                                        name={`fv-${exam.id}`}
                                        checked={correctAnswer === "Falso"}
                                        onChange={() => setCorrectAnswer("Falso")}
                                        className="mr-1"
                                      />
                                      Falso
                                    </label>
                                  </div>
                                )}

                                {tipo === "reactivo" && (
                                  <div>
                                    <input
                                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                                      placeholder="Respuesta correcta (opcional, texto)"
                                      value={correctAnswer ?? ""}
                                      onChange={(e) =>
                                        setCorrectAnswer(e.target.value)
                                      }
                                    />
                                    <small className="text-gray-500">Si dejas vacío, será evaluación manual o comparación libre.</small>
                                  </div>
                                )}

                                {tipo === "relacion_columnas" && (
                              <div>
                    <div className="flex gap-4">
       <div className="flex-1">
        <strong className="text-sm">Columna A</strong>
        {colA.map((v, i) => (
          <div key={i} className="flex gap-2 mt-2">
            <input
              className="flex-1 border border-gray-200 rounded-md px-2 py-1 text-sm"
              value={v}
              onChange={(e) => setColAValue(i, e.target.value)}
              placeholder={`A${i + 1}`}
            />
            <button
              onClick={() =>
                setColA((prev) => prev.filter((_, idx) => idx !== i))
              }
              className="px-2 py-1 text-sm text-red-600"
            >
              X
            </button>
          </div>
        ))}
        <button onClick={addColA} className="mt-2 text-sm text-blue-600">+ A</button>
      </div>

      <div className="flex-1">
        <strong className="text-sm">Columna B</strong>
        {colB.map((v, i) => (
          <div key={i} className="flex gap-2 mt-2">
            <input
              className="flex-1 border border-gray-200 rounded-md px-2 py-1 text-sm"
              value={v}
              onChange={(e) => setColBValue(i, e.target.value)}
              placeholder={`B${i + 1}`}
            />
            <button
              onClick={() =>
                setColB((prev) => prev.filter((_, idx) => idx !== i))
              }
              className="px-2 py-1 text-sm text-red-600"
            >
              X
            </button>
          </div>
        ))}
        <button onClick={addColB} className="mt-2 text-sm text-blue-600">+ B</button>
      </div>
    </div>

              <small className="text-gray-500 block mt-2">
       Se emparejan por índice (A1 ↔ B1, A2 ↔ B2...).
     </small>

    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-md p-3">
      <strong className="text-sm text-gray-700 block mb-2">
        Pares correctos (automático)
      </strong>
      {(colA.length > 0 || colB.length > 0) ? (
        <ul className="text-sm text-gray-700 list-disc pl-4 space-y-1">
          {colA.map((a, i) => (
            <li key={i}>
              <span className="font-medium text-blue-700">
                {a || `A${i + 1}`}
              </span>{" "}
              ↔{" "}
              <span className="font-medium text-green-700">
                {colB[i] || `B${i + 1}`}
              </span>
            </li>
           ))}
           </ul>
                 ) : (
                       <p className="text-gray-500 text-sm">
          Agrega elementos en A y B para generar los pares correctos.
                      </p>
                      )}
                  </div>
                       </div>
          )}
                                <div className="flex gap-3">
                                  <button
                                    onClick={saveQuestion}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                                  >
                                    {editingQuestionId ? "Guardar cambios" : "Guardar pregunta"}
                                  </button>

          
                                  {editingQuestionId && (
                                    <button
                                      onClick={() => {
                                        setEditingQuestionId(null);
                                        setTexto("");
                                        setTipo("");
                                        setOptions(["", ""]);
                                        setCorrectAnswer(null);
                                        setImagen(null);
                                      }}
                                      className="bg-gray-100 px-4 py-2 rounded-md text-sm"
                                    >
                                      Cancelar
                                    </button>
                                  )}
                                </div>
                              </div>



                              <div className="mt-5">
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">📋 Preguntas</h5>

                                {(questionsByExam[exam.id] ?? []).length === 0 ? (
  <p className="text-gray-500">No hay preguntas aún.</p>
) : (
  (questionsByExam[exam.id] ?? []).map((q) => (
    <div
      key={q.id}
      className="flex justify-between items-center py-3 border-b last:border-b-0"
    >
      <div className="flex-1">
        <div className="font-medium">{q.texto}</div>

       {q.image_url && (
  <img
    src={`http://192.168.100.36/sistemaexamenescbtn2_ready1/sistemaexamenescbtn2_ready/backend/${q.image_url}`}
    className="w-32 rounded-md mt-2"
    alt="Pregunta"
    onError={(e) => {
      console.log("Imagen rota:", q.image_url);
      e.target.style.display = "none";
    }}
  />
)}


        <div className="text-sm text-gray-500 mt-1">
          {q.tipo}{" "}
          {q.correct_answer
            ? `• Respuesta: ${q.correct_answer}`
            : ""}
        </div>
      </div>

      <div className="flex gap-2 ml-4">
        <button
          onClick={() => startEditQuestion(q)}
          className="bg-yellow-100 px-3 py-1 rounded-md text-sm"
        >
          ✏️ Editar
        </button>

        <button
          onClick={() => deleteQuestion(q.id)}
          className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  ))
)}


                              </div>
                            </div>

                            
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>© CBT No.2 San Felipe del Progreso</p>
                </div>
              </div>

            </div>
          </div>
        </main>
  
      </div>

      {/* MODAL RETOMAR EXAMEN */}
      {showRetomarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">📥 Retomar Preguntas de Otro Examen</h3>
                <button
                  onClick={() => setShowRetomarModal(false)}
                  className="text-white hover:text-gray-200 text-xl"
                >
                  ✕
                </button>
              </div>
              <p className="text-blue-100 text-sm mt-1">
                Examen destino: <strong>{exams.find(e => e.id === selectedExamId)?.titulo}</strong>
              </p>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Selecciona un examen fuente:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {examenesFuente.map((exam) => (
                    <div
                      key={exam.id}
                      className={`border rounded-lg p-3 cursor-pointer transition ${
                        examenFuenteSeleccionado === exam.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => cargarPreguntasExamenFuente(exam.id)}
                    >
                      <div className="font-medium text-gray-800">{exam.titulo}</div>
                      <div className="text-sm text-gray-600">{exam.descripcion}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Semestre {exam.grade_id} • Grupo {exam.group_id}
                      </div>
                    </div>
                  ))}
                </div>
                {examenesFuente.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No hay otros exámenes disponibles para retomar preguntas
                  </div>
                )}
              </div>

              {examenFuenteSeleccionado && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-800">
                      Preguntas del examen seleccionado ({preguntasSeleccionadas.length} seleccionadas)
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={seleccionarTodasPreguntas}
                        className="text-sm bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Seleccionar todas
                      </button>
                      <button
                        onClick={deseleccionarTodasPreguntas}
                        className="text-sm bg-gray-600 text-white px-3 py-1 rounded"
                      >
                        Limpiar selección
                      </button>
                      <button
                        onClick={cargarSeleccionesGuardadas}
                        className="text-sm bg-purple-600 text-white px-3 py-1 rounded"
                      >
                        📂 Cargar Guardadas
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {preguntasExamenFuente.map((pregunta) => (
                      <div
                        key={pregunta.id}
                        className={`border rounded-lg p-3 transition ${
                          preguntasSeleccionadas.includes(pregunta.id)
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={preguntasSeleccionadas.includes(pregunta.id)}
                            onChange={() => toggleSeleccionPregunta(pregunta.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{pregunta.texto}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              Tipo: {pregunta.tipo} • ID: {pregunta.id}
                            </div>
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
                    {preguntasExamenFuente.length === 0 && (
                      <div className="text-center text-gray-500 py-4">
                        Este examen no tiene preguntas
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* AQUÍ ESTÁ LA SECCIÓN CORREGIDA CON LOS NUEVOS BOTONES */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {preguntasSeleccionadas.length} pregunta(s) seleccionada(s)
              </div>
              <div className="flex gap-2 flex-wrap">
                {/* Botón Debug */}
                <button
                  onClick={debugCompleto}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  🐛 Debug
                </button>

                {/* Botón Probar Una Pregunta */}
                <button
                  onClick={async () => {
                    if (preguntasSeleccionadas.length === 0) {
                      notify("Selecciona al menos una pregunta primero", "warning");
                      return;
                    }
                    const primeraPregunta = preguntasSeleccionadas[0];
                    console.log("🧪 Probando con pregunta:", primeraPregunta);
                    
                    try {
                      const res = await api.post("teacher/retomar_pregunta.php", {
                        target_exam_id: selectedExamId,
                        source_question_id: primeraPregunta
                      });
                      console.log("🧪 Resultado prueba:", res.data);
                      notify(`Prueba: ${res.data.message}`, res.data.success ? "success" : "error");
                    } catch (error) {
                      console.error("🧪 Error en prueba:", error);
                      notify("Error en prueba", "error");
                    }
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                >
                  🧪 Probar 1
                </button>

                {/* Botón Guardar */}
                <button
                  onClick={guardarSelecciones}
                  disabled={preguntasSeleccionadas.length === 0}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  💾 Guardar
                </button>

                {/* Botón Retomar */}
                <button
                  onClick={retomarPreguntasSeleccionadas}
                  disabled={preguntasSeleccionadas.length === 0}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  📥 Retomar ({preguntasSeleccionadas.length})
                </button>

                {/* Botón Cancelar */}
                <button
                  onClick={() => setShowRetomarModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NUEVO MODAL RETOMAR EXAMEN SIMPLE */}
      {showRetomarExamenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="bg-indigo-600 text-white p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">📥 Retomar Preguntas de Exámenes</h3>
                <button
                  onClick={() => setShowRetomarExamenModal(false)}
                  className="text-white hover:text-gray-200 text-xl"
                >
                  ✕
                </button>
              </div>
              <p className="text-indigo-100 text-sm mt-1">
                Selecciona un examen para ver sus preguntas y retomar las que necesites
              </p>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Selecciona un examen:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {examenesParaRetomar.map((exam) => (
                    <div
                      key={exam.id}
                      className={`border rounded-lg p-3 cursor-pointer transition ${
                        examenRetomarSeleccionado === exam.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => cargarPreguntasParaRetomar(exam.id)}
                    >
                      <div className="font-medium text-gray-800">{exam.titulo}</div>
                      <div className="text-sm text-gray-600">{exam.descripcion}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Semestre {exam.grade_id} • Grupo {exam.group_id}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {examenRetomarSeleccionado && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Preguntas del examen seleccionado
                  </h4>
                  
                  <div className="space-y-3">
                    {preguntasParaRetomar.map((pregunta) => (
                      <div
                        key={pregunta.id}
                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{pregunta.texto}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              Tipo: {pregunta.tipo} • ID: {pregunta.id}
                            </div>
                            {pregunta.imagen && (
                              <img 
                                src={pregunta.imagen} 
                                alt="Pregunta" 
                                className="w-32 rounded-md mt-2 border"
                              />
                            )}
                          </div>
                          <button
                            onClick={() => retomarPreguntaSeleccionada(pregunta)}
                            className="ml-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition"
                          >
                            📥 Retomar
                          </button>
                        </div>
                      </div>
                    ))}
                    {preguntasParaRetomar.length === 0 && (
                      <div className="text-center text-gray-500 py-4">
                        Este examen no tiene preguntas
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {examenRetomarSeleccionado && (
                    <span>
                      Examen: <strong>{examenesParaRetomar.find(e => e.id === examenRetomarSeleccionado)?.titulo}</strong>
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => setShowRetomarExamenModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition"
                >
                  ❌ Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

{modalPreguntas && (
  <div className="modal-backdrop">
    <div className="modal">
      <h2 className="text-xl font-semibold mb-4">Preguntas del examen</h2>

      {listaPreguntas.length === 0 && <p>No hay preguntas.</p>}

      {listaPreguntas.map((p) => {
        const examDestinoId = Number(selectedExamId);

        const yaAgregada =
          (questionsByExam[examDestinoId] &&
            Array.isArray(questionsByExam[examDestinoId]) &&
            questionsByExam[examDestinoId].some(
              (q) => Number(q.id) === Number(p.id)
            )) ||
          (examQuestions &&
            Array.isArray(examQuestions) &&
            examQuestions.some((q) => Number(q.id) === Number(p.id)));

        return (
          <div key={p.id} className="p-2 border rounded mb-2">
            <p><strong>{p.texto}</strong></p>

            {yaAgregada ? (
              <p className="text-gray-500 text-sm">✔ Ya agregada</p>
            ) : (
              <button
                onClick={() => retomarPreguntaSeleccionada(p)}
                className="px-3 py-2 bg-green-600 text-white rounded"
              >
                Retomar Pregunta
              </button>
            )}
          </div>
        );
      })}

      <button
        className="mt-3 px-4 py-2 bg-gray-600 text-white rounded"
        onClick={() => setModalPreguntas(false)}
      >
        Cerrar
      </button>
    </div>
  </div>
)}




    </div>

  );
}