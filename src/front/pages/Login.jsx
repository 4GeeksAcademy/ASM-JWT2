import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.status === 200) {

                sessionStorage.setItem("token", data.token);

                sessionStorage.setItem("user", JSON.stringify({
                    id: data.user_id,
                    email: data.email,
                    username: data.username
                }));
                navigate("/private")
            }
            else {
                setError(data.msg || "Email o contraseña incorrectos");
            }
        }
        catch (error) {
            setError("Error de conexión al servidor");
            console.error("Error:", error);
        }
    };

    return (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
                  
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary">
                        Iniciar Sesión
                      </button>
                    </div>
                  </form>
                  
                  <div className="mt-3 text-center">
                    <p>
                      ¿No tienes una cuenta?{" "}
                      <a href="#" onClick={() => navigate("/signup")}>
                        Regístrate aquí
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    export default Login;
    
