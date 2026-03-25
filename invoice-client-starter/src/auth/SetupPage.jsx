import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import FlashMessage from "../components/FlashMessage";
import { apiPost } from "../utils/api";
import { useAuth } from "./AuthContext";

const SetupPage = () => {
    const { setupStatus, refreshSetupStatus } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        password: "",
    });
    const [message, setMessage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        document.title = "Úvodní nastavení";
    }, []);

    if (!setupStatus.setupRequired && !completed) {
        return <Navigate to="/login" replace />;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            await apiPost("/api/setup/bootstrap-admin", formData, { skipAuthRedirect: true });
            await refreshSetupStatus();
            setCompleted(true);
            setMessage({
                theme: "success",
                text: "Administrátor byl vytvořen. Nyní se přihlaste novým účtem.",
            });
        } catch (error) {
            setMessage({
                theme: "danger",
                text: error.body?.message || "Úvodní nastavení se nezdařilo.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow-sm border-0" style={{ maxWidth: "520px", width: "100%" }}>
                <div className="card-body p-4">
                    <h1 className="h3 mb-3 text-center">Úvodní nastavení</h1>
                    <p className="text-muted text-center">
                        V databázi zatím neexistuje žádný uživatel. Vytvořte prvního administrátora.
                    </p>
                    {message && <FlashMessage theme={message.theme} text={message.text} />}

                    {completed ? (
                        <div className="text-center mt-3">
                            <Link to="/login" className="btn btn-primary">Přejít na přihlášení</Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="row g-3">
                            <div className="col-12">
                                <label className="form-label" htmlFor="fullName">Jméno administrátora</label>
                                <input id="fullName" name="fullName" type="text" className="form-control" value={formData.fullName} onChange={handleChange} required />
                            </div>
                            <div className="col-12">
                                <label className="form-label" htmlFor="email">E-mail</label>
                                <input id="email" name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="col-12">
                                <label className="form-label" htmlFor="password">Heslo</label>
                                <input id="password" name="password" type="password" minLength={8} className="form-control" value={formData.password} onChange={handleChange} required />
                            </div>
                            <div className="col-12">
                                <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                                    {submitting ? "Vytvářím..." : "Vytvořit administrátora"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SetupPage;
