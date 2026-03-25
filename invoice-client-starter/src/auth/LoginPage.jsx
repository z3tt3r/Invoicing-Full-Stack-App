import React, { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import FlashMessage from "../components/FlashMessage";
import { useAuth } from "./AuthContext";

const LoginPage = () => {
    const { currentUser, login, isLoading, setupStatus } = useAuth();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(location.state?.flashMessage || null);
    const [submitting, setSubmitting] = useState(false);

    if (!isLoading && setupStatus.setupRequired) {
        return <Navigate to="/setup" replace />;
    }

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
                        Přihlaste se svým účtem.
                    </p>
                    <p className="text-muted text-center small">
                        Nemáte přístup? Kontaktujte administrátora{setupStatus.primaryAdminEmail ? `: ${setupStatus.primaryAdminEmail}` : "."}
                    </p>
                    <p className="text-center small">
                        Pokud je aplikace nová a zatím nemá administrátora, použijte <Link to="/setup">úvodní nastavení</Link>.
                    </p>

                    {error && (
                        <FlashMessage
                            theme={typeof error === "string" ? "danger" : error.theme}
                            text={typeof error === "string" ? error : error.text}
                        />
                    )}

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
