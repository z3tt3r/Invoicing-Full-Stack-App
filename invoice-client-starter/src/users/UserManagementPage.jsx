import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FlashMessage from "../components/FlashMessage";
import { apiGet } from "../utils/api";

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            try {
                const response = await apiGet("/api/admin/users");
                setUsers(response);
            } catch (error) {
                setMessage({
                    theme: "danger",
                    text: error.body?.message || "Uživatele se nepodařilo načíst.",
                });
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
        document.title = "Správa uživatelů";
    }, []);

    return (
        <div className="card shadow-sm mt-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h1 className="h4 card-title mb-0">Správa uživatelů</h1>
                <Link to="/admin/users/new" className="btn btn-success btn-sm">Nový uživatel</Link>
            </div>
            <div className="card-body">
                {message && <FlashMessage theme={message.theme} text={message.text} />}
                {loading ? (
                    <div className="d-flex justify-content-center my-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Načítání...</span>
                        </div>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped align-middle">
                            <thead>
                                <tr>
                                    <th>Jméno</th>
                                    <th>E-mail</th>
                                    <th>Role</th>
                                    <th>Akce</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.fullName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role === "ROLE_ADMIN" ? "Administrátor" : "Uživatel"}</td>
                                        <td className="d-flex gap-2">
                                            <Link to={`/admin/users/${user.id}/edit`} className="btn btn-outline-primary btn-sm">Upravit</Link>
                                            <Link to={`/admin/users/${user.id}/password`} className="btn btn-outline-secondary btn-sm">Reset hesla</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagementPage;
