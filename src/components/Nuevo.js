import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { app } from "../firebase";
import "./estilos/Nuevo.css";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

const db = getFirestore(app);
const auth = getAuth(app);
const TOTAL_STEPS = 4;

function Nuevo() {
  const [step, setStep] = useState(1);
  const [titulo, setTitulo] = useState("");
  const [deporte, setDeporte] = useState("");
  const [modo, setModo] = useState("");
  const [tipo, setTipo] = useState("");
  const [numEquipos, setNumEquipos] = useState('');
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Debes iniciar sesión para crear un torneo.");
      return;
    }
    if (!titulo || !deporte || !modo || !tipo || !numEquipos || numEquipos < 2) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
    }

    const codigo = uuidv4().slice(0, 6).toUpperCase();

    const torneoData = {
      titulo,
      deporte,
      modo,
      tipo,
      numEquipos: parseInt(numEquipos, 10),
      creadorId: user.uid,
      codigo,
      participantes: [],
      fechaCreacion: new Date(),
    };

    try {
      const docRef = await addDoc(collection(db, "torneos"), torneoData);
      alert(`Torneo "${titulo}" creado con éxito.\nCódigo: ${codigo}\nID: ${docRef.id}`);
      
      // Navegar a Home después de crear el torneo y mostrar la alerta
      navigate("/home"); 

      // Ya no es necesario resetear el formulario aquí si navegas inmediatamente
      // setStep(1);
      // setTitulo('');
      // setDeporte('');
      // setModo('');
      // setTipo('');
      // setNumEquipos('');

    } catch (error) {
      console.error("Error creando torneo:", error);
      alert("Hubo un error al crear el torneo. Por favor, inténtalo de nuevo.");
    }
  };

  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePrevStep = () => setStep(prev => prev - 1);

  const progressPercent = (step / TOTAL_STEPS) * 100;

  return (
    <div className="nuevo-torneo-page-container">
      <div className="nuevo-torneo-container">

        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <span className="progress-step-text">Paso {step} de {TOTAL_STEPS}</span>

        <div className="form-step-content">
          {step === 1 && (
            <div className="form-step">
              <h2>Información básica</h2>
              <input
                className="form-input"
                type="text"
                placeholder="Título del Torneo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
              <input
                className="form-input"
                type="text"
                placeholder="Deporte"
                value={deporte}
                onChange={(e) => setDeporte(e.target.value)}
                required
              />
              <div className="form-navigation">
                <button className="form-button primary" onClick={handleNextStep} disabled={!titulo || !deporte}>Siguiente</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h2>Tipo de participación</h2>
              <div className="form-button-group">
                <button
                  className={`form-button choice ${modo === 'individual' ? 'selected' : ''}`}
                  onClick={() => { setModo("individual"); handleNextStep(); }}
                >
                  Individual
                </button>
                <button
                  className={`form-button choice ${modo === 'equipo' ? 'selected' : ''}`}
                  onClick={() => { setModo("equipo"); handleNextStep(); }}
                >
                  Por equipos
                </button>
              </div>
              <div className="form-navigation">
                <button className="form-button secondary" onClick={handlePrevStep}>Anterior</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <h2>Formato del torneo</h2>
               <div className="form-button-group">
                <button
                  className={`form-button choice ${tipo === 'liga' ? 'selected' : ''}`}
                  onClick={() => { setTipo("liga"); handleNextStep(); }}
                >
                  Liga
                </button>
                <button
                  className={`form-button choice ${tipo === 'torneo' ? 'selected' : ''}`}
                  onClick={() => { setTipo("torneo"); handleNextStep(); }}
                >
                  Eliminatoria (Torneo)
                </button>
              </div>
               <div className="form-navigation">
                 <button className="form-button secondary" onClick={handlePrevStep}>Anterior</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="form-step">
              <h2>Número de {modo === "equipo" ? "equipos" : "participantes"}</h2>
              <select
                className="form-input"
                value={numEquipos}
                onChange={(e) => setNumEquipos(e.target.value)}
                required
              >
                <option value="" disabled>Seleccionar número...</option>
                {tipo === 'torneo' ? (
                  <>
                    <option value={4}>4</option>
                    <option value={8}>8</option>
                    <option value={16}>16</option>
                    <option value={32}>32</option>
                  </>
                ) : (
                  <>
                    {[...Array(19)].map((_, i) => (
                        <option key={i + 2} value={i + 2}>{i + 2}</option>
                    ))}
                  </>
                )}
              </select>

              <div className="form-navigation">
                 <button className="form-button secondary" onClick={handlePrevStep}>Anterior</button>
                <button className="form-button primary" onClick={handleSubmit} disabled={!numEquipos}>Crear Torneo</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nuevo;