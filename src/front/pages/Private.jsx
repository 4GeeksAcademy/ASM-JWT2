// src/front/js/pages/Private.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Private = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Primero, verificamos si hay un token en sessionStorage
    const token = sessionStorage.getItem("token");
    
    if (!token) {
      // si no existe, nos regresa al login
      navigate("/login");
      return;
    }

    // Verificamos la validez del token
    const verifyToken = async () => {
      try {
        const response = await fetch(process.env.BACKEND_URL + "/api/protected", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.status === 200) {
          // Es válido, se guarda los datos 
          setUserData(data.logged_in_as);
        } else {
          // Token inválido, te regresa al login 2 seg despues de mostrarte el error
          setError(data.msg || "Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
          sessionStorage.removeItem("token");
          setTimeout(() => {
            navigate("/login");
          }, 2000); 
        }
      } catch (error) {
        setError("Error de conexión al servidor");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [navigate]); 

  // esto es cuando se cierra la sesión
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Verificando autenticación...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Área Privada</h4>
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </div>
            
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {userData && (
                <div>
                  <h5 className="card-title">¡Bienvenido, {userData.username}!</h5>
                  <p className="card-text">
                    Has accedido correctamente al área privada de la aplicación.
                  </p>
                  <div className="alert alert-info">
                    <h6>Información de tu cuenta:</h6>
                    <ul className="list-unstyled">
                      <li><strong>ID:</strong> {userData.id}</li>
                      <li><strong>Email:</strong> {userData.email}</li>
                      <li><strong>Usuario:</strong> {userData.username}</li>
                    </ul>
                  </div>
                  <p>
                    Este contenido solo es visible para usuarios autenticados. 
                    Tu sesión seguirá activa mientras no cierres sesión o el token expire.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Private;