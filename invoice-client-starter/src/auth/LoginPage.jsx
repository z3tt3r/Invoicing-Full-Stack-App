import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import FlashMessage from "../components/FlashMessage";
import { useAuth } from "./AuthContext";

const LoginPage = () => {
    const { currentUser, login, isLoading } = useAuth();
    const location = useLocation();
    const [email, setEmail] = useState("admin@example.com");
    const [password, setPassword] = useState("admin123");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    if (!isLoading && currentUser) {
        const destination = location.state?.from?.pathname || "/persons";
        return <Navigate to={destination} replace />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const destination = location.state?.from?.pathname || "/persons";
            await login(email, password, destination);
        } catch (submitError) {
            setError("Přihlášení se nezdařilo. Zkontrolujte e-mail a heslo.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow-sm border-0" style={{ maxWidth: "420px", width: "100%" }}>
                <div className="card-body p-4">
                    <h1 className="h3 mb-2 text-center">Přihlášení</h1>
                    <p className="text-muted text-center mb-4">
                        Pro demo účet můžete použít předvyplněné údaje.
                    </p>

                    {error && <FlashMessage theme="danger" text={error} />}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="email">E-mail</label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label" htmlFor="password">Heslo</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                            {submitting ? "Přihlašuji..." : "Přihlásit se"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
