import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";
import Informacion from "./Información";
import Participantes from "./Participantes";
import Calendario from "./Calendario";
import Clasificacion from "./Clasificacion";
import "./estilos/Torneo.css";
import { FaInfoCircle, FaUsers, FaCalendarAlt, FaChartBar, FaQuestionCircle, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const db = getFirestore(app);
const authInstance = getAuth(app);

function Torneo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [componenteActivo, setComponenteActivo] = useState(null);
  const [tituloTorneo, setTituloTorneo] = useState("");
  const [hayNotificacionesInfoNoLeidas, setHayNotificacionesInfoNoLeidas] = useState(false);
  const [creadorId, setCreadorId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isCreator, setIsCreator] = useState(false);

  // Efecto para la autenticación del usuario actual
  useEffect(() => {
    const unsubscribe = authInstance.onAuthStateChanged(user => {
      setCurrentUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  // Efecto para cargar la información del torneo
  useEffect(() => {
    const fetchTorneo = async () => {
      if (!id) {
        console.error("[Torneo.js] No se proporcionó ID de torneo.");
        setTituloTorneo("Torneo no encontrado");
        setCreadorId(null);
        return;
      }
      try {
        const torneoRef = doc(db, "torneos", id);
        const torneoSnapshot = await getDoc(torneoRef);

        if (torneoSnapshot.exists()) {
          const torneoData = torneoSnapshot.data();
          setTituloTorneo(torneoData.titulo);
          setCreadorId(torneoData.creadorId);

          if (location.state?.activeTab && location.state?.fromDetails) {
            setComponenteActivo(location.state.activeTab);
            navigate(location.pathname, { replace: true, state: {} });
          } else if (componenteActivo === null) {
            setComponenteActivo("componente1");
          }
        } else {
          setTituloTorneo("Torneo no encontrado");
          setCreadorId(null);
          if (componenteActivo === null && !location.state?.activeTab) setComponenteActivo(null);
        }
      } catch (error) {
          console.error("[Torneo.js] Error al cargar el torneo:", error);
          setTituloTorneo("Error al cargar");
          setCreadorId(null);
          if (componenteActivo === null && !location.state?.activeTab) setComponenteActivo(null);
      }
    };

    fetchTorneo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location.state]);

  // Determina si el usuario actual es el creador del torneo
  useEffect(() => {
    setIsCreator(currentUserId && creadorId && currentUserId === creadorId);
  }, [currentUserId, creadorId]);

  const handleGoToHome = () => {
    navigate("/home");
  };

  const handleUnreadInfoStatus = (status) => {
    setHayNotificacionesInfoNoLeidas(status);
  };

  const handleInformacionClick = () => {
    setComponenteActivo("componente1");
    const currentUser = authInstance.currentUser;
    if (currentUser && hayNotificacionesInfoNoLeidas) {
      const ultimaVisitaKey = `ultimaVisitaNovedades_${id}_${currentUser.uid}`;
      localStorage.setItem(ultimaVisitaKey, Date.now().toString());
      setHayNotificacionesInfoNoLeidas(false);
    }
  };

  // Renderiza el componente activo según la navegación
  const renderComponente = () => {
    switch (componenteActivo) {
      case "componente1":
        return <Informacion torneoId={id} onUnreadNovedadesChange={handleUnreadInfoStatus} isCreator={isCreator} currentUserId={currentUserId} />;
      case "participantes":
        return <Participantes torneoId={id} isCreator={isCreator} />;
      case "calendario":
        return <Calendario torneoId={id} isCreator={isCreator} />;
      case "clasificacion":
        return <Clasificacion torneoIdProp={id} isCreatorProp={isCreator} />;
      default:
        if (tituloTorneo === "Torneo no encontrado" || tituloTorneo === "Error al cargar") {
             return (
                 <div className="contenido-placeholder">
                     <FaExclamationTriangle size={60} style={{ marginBottom: '1.5rem', color: '#cc0000' }} />
                     <h2>{tituloTorneo}</h2>
                     <p>No se pudo cargar la información del torneo. Verifica el ID o inténtalo más tarde.</p>
                 </div>
             );
        }
        return (
          <div className="contenido-placeholder">
             <FaQuestionCircle size={60} style={{ marginBottom: '1.5rem', color: '#444' }} />
             <h2>Selecciona una sección</h2>
             <p>Usa la barra lateral izquierda para navegar por la información del torneo.</p>
          </div>
        );
    }
  };

  // Animaciones para la transición entre componentes
  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  };

  const pageTransition = {
    type: "tween",
    ease: "linear",
    duration: 0.1
  };

  return (
    <div className="torneo-page-container">
      <header className="torneo-header">
        <button
          onClick={handleGoToHome}
          title="Volver"
          className="torneo-header-home-button"
        >
          <FaArrowLeft />
        </button>
        <span className="torneo-header-title">{tituloTorneo || "Cargando..."}</span>
        <div style={{ width: '40px', height: '100%' }}></div>
      </header>
      <main className="torneo-main">
        <nav className="vertical-sidebar">
          <button
            className={`sidebar-item ${componenteActivo === 'componente1' ? 'active' : ''}`}
            onClick={handleInformacionClick}
            data-tooltip="Información"
            aria-label="Información"
          >
            <FaInfoCircle size={24} />
            {hayNotificacionesInfoNoLeidas && (
              <span className="notification-dot-sidebar"></span>
            )}
          </button>
          <button
            className={`sidebar-item ${componenteActivo === 'participantes' ? 'active' : ''}`}
            onClick={() => setComponenteActivo("participantes")}
            data-tooltip="Participantes"
            aria-label="Participantes"
          >
            <FaUsers size={24} />
          </button>
          <button
            className={`sidebar-item ${componenteActivo === 'calendario' ? 'active' : ''}`}
            onClick={() => setComponenteActivo("calendario")}
            data-tooltip="Calendario"
            aria-label="Calendario"
          >
            <FaCalendarAlt size={24} />
          </button>
          <button
            className={`sidebar-item ${componenteActivo === 'clasificacion' ? 'active' : ''}`}
            onClick={() => setComponenteActivo("clasificacion")}
            data-tooltip="Clasificación"
            aria-label="Clasificación"
          >
            <FaChartBar size={24} />
          </button>
        </nav>

        <div className="torneo-contenido">
            <AnimatePresence mode="wait">
              <motion.div
                key={componenteActivo || "default"}
                className="contenido-bloque"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                 {renderComponente()}
              </motion.div>
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default Torneo;