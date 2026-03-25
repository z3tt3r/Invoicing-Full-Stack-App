import React, { useState } from "react";
import FlashMessage from "../components/FlashMessage";
import { apiPut } from "../utils/api";
import { useAuth } from "../auth/AuthContext";

const ChangePasswordPage = () => {
    const { logout } = useAuth();
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            await apiPut("/api/account/password", formData);
            await logout("/login", {
                flashMessage: {
                    theme: "success",
                    text: "Heslo bylo změněno. Přihlaste se prosím znovu.",
                },
            });
        } catch (error) {
            setMessage({
                theme: "danger",
                text: error.body?.message || "Změna hesla se nezdařila.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card shadow-sm mt-4">
            <div className="card-header bg-white">
                <h1 className="h4 card-title mb-0">Změna hesla</h1>
            </div>
            <div className="card-body">
                {message && <FlashMessage theme={message.theme} text={message.text} />}
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-12">
                        <label className="form-label" htmlFor="currentPassword">Aktuální heslo</label>
                        <input id="currentPassword" name="currentPassword" type="password" className="form-control" value={formData.currentPassword} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="newPassword">Nové heslo</label>
                        <input id="newPassword" name="newPassword" type="password" minLength={8} className="form-control" value={formData.newPassword} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="confirmPassword">Potvrzení hesla</label>
                        <input id="confirmPassword" name="confirmPassword" type="password" minLength={8} className="form-control" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Ukládám..." : "Změnit heslo"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
