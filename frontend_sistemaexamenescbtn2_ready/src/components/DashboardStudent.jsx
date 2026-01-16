import { useEffect, useState } from "react";
import { api } from "../Api";
import Swal from "sweetalert2";


export default function DashboardStudent({ user, onLogout }) {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [examResult, setExamResult] = useState(null);

  const [timeLeft, setTimeLeft] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (selectedExam && selectedExam.time_limit) {
      const totalSeconds = selectedExam.time_limit * 60;
      setTimeLeft(totalSeconds);
      setTimerActive(true);
    }
  }, [selectedExam]);

  // ⏱️ Contador que reduce el tiempo cada segundo
  useEffect(() => {
    if (!timerActive || timeLeft === null) return;
    if (timeLeft <= 0) {
      setTimerActive(false);
      handleSubmitExam(); // 🔴 Enviar automáticamente cuando se acaba el tiempo
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerActive]);




  // 🔹 Cargar exámenes disponibles
  const fetchExams = async () => {
    try {
      const res = await api.get(
        `student/get_available_exams.php?student_id=${user.id}`
      );
      if (res.data.success && Array.isArray(res.data.exams)) {
        setExams(res.data.exams);
      } else {
        setExams([]);
      }
    } catch (err) {
      console.error("❌ Error al cargar exámenes:", err);
      setExams([]);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // 🔹 Seleccionar examen
 const handleSelectExam = async (exam) => {
  try {
    // Si el examen ya está completado, mostrar resultado
    if (exam.completed) {
      const result = await api.get(
        `student/get_exam_result.php?student_id=${user.id}&exam_id=${exam.id}`
      );
      setExamResult(result.data);
      setSelectedExam(exam);
      return;
    }

    // Consultar preguntas del examen
    const res = await api.get(`student/get_questions.php?exam_id=${exam.id}`);

    // ⚠️ Si el backend dice que el examen NO está habilitado
    if (!res.data.success) {
      Swal.fire({
        title: "⛔ Examen no disponible",
        text: res.data.message || "El docente aún no ha habilitado este examen.",
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      return;
    }

    // Si sí está habilitado, continuar
    setSelectedExam(exam);

    if (Array.isArray(res.data.questions)) {
      const fixedQuestions = res.data.questions.map((q) => {
        let meta = q.metadata;

        if (typeof meta === "string") {
          try {
            meta = JSON.parse(meta);
          } catch {
            meta = [];
          }
        }

        if (Array.isArray(meta)) {
          return { ...q, metadata: meta };
        } else if (meta && typeof meta === "object") {
          return { ...q, metadata: meta };
        } else {
          return { ...q, metadata: [] };
        }
      });

      setQuestions(fixedQuestions);
    } else {
      setQuestions([]);
    }

    setAnswers({});
    setExamResult(null);

  } catch (error) {
    console.error("❌ Error al seleccionar examen:", error);
  }
};


  // 🔹 Registrar respuesta
  const handleAnswerChange = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  // // 🔹 Enviar examen con SweetAlert2
const handleSubmitExam = async () => {
  if (!selectedExam) return;

  if (Object.keys(answers).length === 0) {
    Swal.fire({
      title: "⚠️ Atención",
      text: "Contesta al menos una pregunta antes de enviar el examen.",
      icon: "warning",
      confirmButtonText: "Entendido",
    });
    return;
  }

  try {
    // 🧠 Formatear las respuestas correctamente antes de enviar
    const formattedResponses = Object.entries(answers).map(
      ([question_id, answer]) => {
        // Si la respuesta es un objeto (por ejemplo relación de columnas)
        if (typeof answer === "object") {
          return { question_id, answer: JSON.stringify(answer) };
        }
        return { question_id, answer };
      }
    );

    const res = await api.post("student/submit_exam.php", {
      student_id: user.id,
      exam_id: selectedExam.id,
      responses: formattedResponses,
    });

    if (res.data.error) {
      Swal.fire({
        title: "❌ Error",
        text: res.data.error,
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }

    // 🎉 Mostrar resultado con SweetAlert
    await Swal.fire({
      title:
        res.data.score >= 70
          ? "🎉 ¡Examen enviado correctamente!"
          : "❌ Examen enviado",
      text:
        res.data.score >= 70
          ? `Tu puntaje fue de ${res.data.score}% — ¡Felicidades!`
          : `Tu puntaje fue de ${res.data.score}%. Sigue intentando.`,
      icon: res.data.score >= 70 ? "success" : "error",
      confirmButtonText: "Ver retroalimentación",
      confirmButtonColor: res.data.score >= 70 ? "#16a34a" : "#dc2626",
    });

    // Esperar un poco antes de cargar resultado
    await new Promise((r) => setTimeout(r, 400));

    const result = await api.get(
      `student/get_exam_result.php?student_id=${user.id}&exam_id=${selectedExam.id}`
    );

    const uniqueAnswers = [];
    const seen = new Set();
    (result.data.answers ?? []).forEach((q) => {
      if (!seen.has(q.question_id)) {
        uniqueAnswers.push(q);
        seen.add(q.question_id);
      }
    });

    setExamResult({ ...result.data, answers: uniqueAnswers });
    fetchExams();
  } catch (error) {
    console.error("❌ Error al enviar examen:", error);
    Swal.fire({
      title: "Error de conexión",
      text: "Hubo un error al enviar el examen. Intenta de nuevo.",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
};


  // 🔹 Volver a lista
  const handleBackToExams = () => {
    setSelectedExam(null);
    setExamResult(null);
    setQuestions([]);
    setAnswers({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Bienvenido Alumno:{" "}
            <span className="text-blue-600">{user.username}</span>
          </h2>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Cerrar sesión
          </button>
        </div>

        {/* 🔹 Lista de exámenes */}
        {!selectedExam && !examResult && (
          <section>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              📚 Exámenes disponibles
            </h3>
            <ul className="space-y-3">
              {exams.length === 0 && (
                <li className="text-gray-500 text-center">
                  No hay exámenes disponibles
                </li>
              )}
              {exams.map((e) => (
                <li
                  key={e.id}
                  className={`p-4 border rounded-xl transition ${
                    e.completed
                      ? "bg-gray-100 border-gray-300"
                      : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    
                    <div>
                      <strong className="text-gray-800">{e.titulo}</strong>
                      <p className="text-gray-600 text-sm">{e.descripcion}</p>
                    </div>

                    {e.time_limit && (
                 <p className="text-sm text-gray-500 mt-1">
                   ⏱️ Tiempo disponible: <span className="font-medium">{e.time_limit} minutos</span>
                       </p>
                    )}





                    {e.completed ? (
                      <button
                        onClick={() => handleSelectExam(e)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                      >
                        Ver resultado
                      </button>
                    ) : (
                     <button
  onClick={() => handleSelectExam(e)}
  className="text-white px-3 py-1 rounded-lg transition"
  style={{ backgroundColor: "#7A0019" }}
  onMouseOver={(e) => (e.target.style.backgroundColor = "#5E0013")}
  onMouseOut={(e) => (e.target.style.backgroundColor = "#7A0019")}
>
  Abrir examen
</button>

                    )}
                  </div>
                  {e.completed && (
                    <p className="text-gray-500 text-sm mt-2">
                      📊 Puntaje: {e.score ?? 0}%
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 🔹 Examen activo */}
        {selectedExam && !examResult && (
          <section className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedExam.titulo}
            </h3>

            

      {selectedExam.time_limit && (
  <div className="mb-4 flex items-center gap-2">
    <span className="text-gray-600">
      ⏱️ Tiempo máximo: {selectedExam.time_limit} minutos
    </span>

    {timeLeft !== null && (
      <span
        className={`ml-auto font-bold px-3 py-1 rounded-lg ${
          timeLeft <= 60
            ? "bg-red-100 text-red-600 animate-pulse"
            : "bg-green-100 text-green-700"
        }`}
      >
        {Math.floor(timeLeft / 60)
          .toString()
          .padStart(2, "0")}
        :
        {(timeLeft % 60).toString().padStart(2, "0")}
      </span>
    )}
  </div>
)}


            {questions.map((q) => (
              <div
                key={q.id}
                className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50"
              >
                <p className="font-medium text-gray-800 mb-2">{q.texto}</p>

                {/* 🖼️ Mostrar imagen si existe */}
                {q.image_url && (
                  <div className="mb-3">
                    <img
                      src={q.image_url}
                      alt="Imagen de la pregunta"
                      className="rounded-lg border shadow-sm"
                      style={{
                        width: "180px",
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                )}

                {["multiple", "falso_verdadero", "cerrada"].includes(q.tipo) &&
                (Array.isArray(q.metadata) ? q.metadata : []).map((opt, i) => (
              <label
                    key={i}
                  className="block bg-white border rounded-md px-3 py-1 mt-2 hover:bg-blue-50 cursor-pointer"
               >
                <input
                 type="radio"
                  name={`q_${q.id}`}
                 value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleAnswerChange(q.id, opt)}
                   className="mr-2 accent-blue-600"
             />
               {opt}
            </label>
          ))}

          {/* 🟣 Reactivo / texto corto */}
{q.tipo === "reactivo" && (
  <div className="mt-2">
    <input
      type="text"
      placeholder="Escribe tu respuesta..."
      value={answers[q.id] || ""}
      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
      className="w-full border p-2 rounded"
    />
  </div>
)}

{/* 🟠 Relación de columnas (interactiva con selects) */}
{q.tipo === "relacion_columnas" && (
  <div className="mt-3 bg-gray-100 p-4 rounded-xl">
    
    {(q.metadata?.columnaA || []).map((itemA, index) => (
      <div key={index} className="flex items-center gap-3 mb-2">
        <span className="font-medium text-gray-800 w-1/3">{itemA}</span>
        <select
          className="border rounded-md p-2 w-2/3 bg-white"
          value={answers[q.id]?.[index] || ""}
          onChange={(e) =>
            setAnswers((prev) => ({
              ...prev,
              [q.id]: {
                ...(prev[q.id] || {}),
                [index]: e.target.value,
              },
            }))
          }
        >
          <option value="">Selecciona...</option>
          {(q.metadata?.columnaB || []).map((itemB, i) => (
            <option key={i} value={itemB}>
              {itemB}
            </option>
          ))}
        </select>
      </div>
    ))}
  </div>
)}




              </div>
            ))}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleBackToExams}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
              >
                Volver
              </button>
              <button
  onClick={handleSubmitExam}
  className="text-white px-4 py-2 rounded-lg transition"
  style={{ backgroundColor: "#7A0019" }}
  onMouseOver={(e) => (e.target.style.backgroundColor = "#5E0013")}
  onMouseOut={(e) => (e.target.style.backgroundColor = "#7A0019")}
>
  Enviar Examen
</button>

            </div>
          </section>
        )}

        {/* 🔹 Resultado con aprobado/reprobado */}
        {examResult && (
  <section className="mt-8">
    <h3 className="text-xl font-semibold text-gray-800 mb-3">
      📊 Resultado del examen
    </h3>
    <h4 className="text-lg text-blue-700 font-medium mb-4">
      Puntaje: {examResult.score ?? 0}%
    </h4>

    {(examResult.answers ?? []).map((q, idx) => {
      // Convertimos metadata a array seguro
      const opciones = Array.isArray(q.metadata)
        ? q.metadata
        : typeof q.metadata === "string"
        ? JSON.parse(q.metadata || "[]")
        : [];

      const correcta = q.correcta ?? q.correct_answer;
      const respuestaAlumno = q.answer;

      const esCorrecta = respuestaAlumno === correcta;

      return (
        <div
          key={`${q.question_id}-${idx}`}
          className="border border-gray-200 rounded-xl p-4 mb-5 bg-gray-50 shadow-sm"
        >
          <p className="font-medium text-gray-800 mb-2">
            {idx + 1}. {q.texto}
          </p>

          {/* 🖼️ Imagen de la pregunta */}
          {q.image_url && (
            <div className="my-2">
              <img
                src={q.image_url}
                alt="Imagen de la pregunta"
                className="rounded-lg border shadow-sm"
                style={{ width: "180px", height: "auto", objectFit: "contain" }}
              />
            </div>
          )}

          {/* Opciones con colores */}
          <ul className="mt-2 space-y-1">
            {opciones.map((opt, i) => {
              const esOpcionCorrecta = opt === correcta;
              const esSeleccionada = opt === respuestaAlumno;

              return (
                <li
                  key={i}
                  className={`px-3 py-1 rounded-md border ${
                    esOpcionCorrecta
                      ? "bg-green-100 border-green-400 text-green-700 font-semibold"
                      : esSeleccionada && !esOpcionCorrecta
                      ? "bg-red-100 border-red-400 text-red-700 font-semibold"
                      : "border-gray-300"
                  }`}
                >
                  {opt}
                  {esOpcionCorrecta && " ✅"}
                  {esSeleccionada && !esOpcionCorrecta && " ❌"}
                </li>
              );
            })}
          </ul>

          {/* 🧩 Texto resumen */}
          <div className="mt-3 text-sm">
            {esCorrecta ? (
              <p className="text-green-700 font-semibold">
                ✅ Tu respuesta es correcta: <span>{respuestaAlumno}</span>
              </p>
            ) : (
              <div>
                <p className="text-red-700 font-semibold">
                  ❌ Tu respuesta: <span>{respuestaAlumno || "Sin responder"}</span>
                </p>
                <p className="text-green-700 font-semibold">
                  ✅ Respuesta correcta: <span>{correcta}</span>
                </p>
              </div>
            )}
          </div>

     {/* 🟢 Resultado de relación de columnas */}
{q.tipo === "relacion_columnas" &&
  q.metadata?.columnaA &&
  q.metadata?.columnaB && (
    <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
      <h4 className="font-semibold text-gray-700 mb-3">
        Resultado de tu relación de columnas:
      </h4>

      {q.metadata.columnaA.map((itemA, i) => {
        const respuestaAlumno = q.answer?.[i] ?? "";
        const correcta = q.correcta?.[i] ?? "";
        const esCorrecta = respuestaAlumno === correcta;

        return (
          <div
            key={i}
            className={`flex justify-between items-center border p-2 rounded-md mb-2 transition ${
              esCorrecta
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-red-100 border-red-400 text-red-700"
            }`}
          >
            <span className="font-medium">{itemA}</span>
            <span>
              {respuestaAlumno
                ? `${respuestaAlumno} ${esCorrecta ? "✅" : "❌"}`
                : "Sin respuesta"}
            </span>
          </div>
        );
      })}
    </div>
  )}


        </div>
      );
    })}

    <button
      onClick={handleBackToExams}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
    >
      Volver a Exámenes
    </button>
  </section>
)}

      </div>
    </div>
  );
}
