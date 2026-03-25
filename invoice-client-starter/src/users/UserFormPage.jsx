import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FlashMessage from "../components/FlashMessage";
import { apiGet, apiPatch, apiPost } from "../utils/api";

const defaultForm = {
    email: "",
    fullName: "",
    role: "ROLE_USER",
    password: "",
};

const UserFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const [formData, setFormData] = useState(defaultForm);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isEdit) {
            document.title = "Nový uživatel";
            return;
        }

        const loadUser = async () => {
            setLoading(true);
            try {
                const user = await apiGet(`/api/admin/users/${id}`);
                setFormData({
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    password: "",
                });
                document.title = `Uživatel: ${user.fullName}`;
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
    }, [id, isEdit]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            if (isEdit) {
                await apiPatch(`/api/admin/users/${id}`, {
                    email: formData.email,
                    fullName: formData.fullName,
                    role: formData.role,
                });
            } else {
                await apiPost("/api/admin/users", formData);
            }

            navigate("/admin/users");
        } catch (error) {
            setMessage({
                theme: "danger",
                text: error.body?.message || "Uložení uživatele se nezdařilo.",
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
                <h1 className="h4 card-title mb-0">{isEdit ? "Upravit uživatele" : "Nový uživatel"}</h1>
                <Link to="/admin/users" className="btn btn-outline-secondary btn-sm">Zpět</Link>
            </div>
            <div className="card-body">
                {message && <FlashMessage theme={message.theme} text={message.text} />}
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="fullName">Jméno</label>
                        <input id="fullName" name="fullName" type="text" className="form-control" value={formData.fullName} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="email">E-mail</label>
                        <input id="email" name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="role">Role</label>
                        <select id="role" name="role" className="form-select" value={formData.role} onChange={handleChange}>
                            <option value="ROLE_USER">Uživatel</option>
                            <option value="ROLE_ADMIN">Administrátor</option>
                        </select>
                    </div>
                    {!isEdit && (
                        <div className="col-md-6">
                            <label className="form-label" htmlFor="password">Dočasné heslo</label>
                            <input id="password" name="password" type="password" minLength={8} className="form-control" value={formData.password} onChange={handleChange} required />
                        </div>
                    )}
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Ukládám..." : "Uložit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormPage;
