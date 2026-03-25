import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FlashMessage from "../components/FlashMessage";
import { apiGet, apiPut } from "../utils/api";

const UserPasswordPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            setLoading(true);
            try {
                const response = await apiGet(`/api/admin/users/${id}`);
                setUser(response);
            } catch (error) {
                setMessage({
                    theme: "danger",
                    text: error.body?.message || "Uživatele se nepodařilo načíst.",
                });
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setMessage(null);

        if (password !== confirmPassword) {
            setMessage({
                theme: "danger",
                text: "Nové heslo a potvrzení hesla se neshodují.",
            });
            setSubmitting(false);
            return;
        }

        try {
            await apiPut(`/api/admin/users/${id}/password`, { newPassword: password });
            navigate("/admin/users");
        } catch (error) {
            setMessage({
                theme: "danger",
                text: error.body?.message || "Reset hesla se nezdařil.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Načítání...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="card shadow-sm mt-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h1 className="h4 card-title mb-0">Reset hesla</h1>
                <Link to="/admin/users" className="btn btn-outline-secondary btn-sm">Zpět</Link>
            </div>
            <div className="card-body">
                {user && <p className="text-muted">Uživatel: {user.fullName} ({user.email})</p>}
                {message && <FlashMessage theme={message.theme} text={message.text} />}
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="password">Nové heslo</label>
                        <input id="password" type="password" minLength={8} className="form-control" value={password} onChange={(event) => setPassword(event.target.value)} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="confirmPassword">Potvrzení hesla</label>
                        <input id="confirmPassword" type="password" minLength={8} className="form-control" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Ukládám..." : "Resetovat heslo"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserPasswordPage;
