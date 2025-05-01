import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();


	const handleLogout = () => {
		dispatch({ type: "logout" });
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Auth Demo</span>
				</Link>

				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav ms-auto">
						{store.auth.isAuthenticated ? (
							<>
								<li className="nav-item">
									<Link to="/private" className="nav-link">
										Área Privada
									</Link>
								</li>
								<li className="nav-item">
									<button
										className="btn btn-outline-danger ms-2"
										onClick={handleLogout}
									>
										Cerrar Sesión
									</button>
								</li>
							</>
						) : (
							<>
								<li className="nav-item">
									<Link to="/login" className="nav-link">
										Iniciar Sesión
									</Link>
								</li>
								<li className="nav-item">
									<Link to="/signup" className="nav-link">
										Registrarse
									</Link>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};