import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    BrowserRouter as Router,
    Link,
    Route,
    Routes,
    Outlet,
    Navigate,
} from "react-router-dom";

import PersonIndex from "./persons/PersonIndex";
import PersonDetail from "./persons/PersonDetail";
import PersonForm from "./persons/PersonForm";
import InvoiceIndex from "./invoices/InvoiceIndex";
import InvoiceDetail from "./invoices/InvoiceDetail";
import InvoiceForm from "./invoices/InvoiceForm";
import StatisticsIndex from "./statistics/StatisticsIndex";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import LoginPage from "./auth/LoginPage";

function AppLayout() {
    const { currentUser, logout } = useAuth();

    return (
        <div className="bg-light min-vh-100">
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm p-3 rounded fixed-top">
                <div className="container">
                    <span className="navbar-brand mb-0 h1">Databáze faktur</span>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to={"/persons"} className="nav-link">
                                    Osoby
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={"/invoices"} className="nav-link">
                                    Faktury
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={"/statistics"} className="nav-link">
                                    Statistiky
                                </Link>
                            </li>
                        </ul>
                        <div className="d-flex align-items-center gap-3">
                            <span className="text-muted small">
                                {currentUser?.fullName} ({currentUser?.email})
                            </span>
                            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={logout}>
                                Odhlásit se
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container" style={{ paddingTop: '70px' }}>
                <Outlet />
            </div>
        </div>
    );
}

function HomeRedirect() {
    const { currentUser, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    return <Navigate to={currentUser ? "/persons" : "/login"} replace />;
}

export function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route index element={<HomeRedirect />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route element={<AppLayout />}>
                            <Route path="/persons">
                                <Route index element={<PersonIndex />} />
                                <Route path="show/:id" element={<PersonDetail />} />
                                <Route path="create" element={<PersonForm />} />
                                <Route path="edit/:id" element={<PersonForm />} />
                            </Route>
                            <Route path="/invoices">
                                <Route index element={<InvoiceIndex />} />
                                <Route path="show/:id" element={<InvoiceDetail />} />
                                <Route path="create" element={<InvoiceForm />} />
                                <Route path="edit/:id" element={<InvoiceForm />} />
                                <Route path="by-seller/:identificationNumber" element={<InvoiceIndex />} />
                                <Route path="by-buyer/:identificationNumber" element={<InvoiceIndex />} />
                            </Route>
                            <Route path="/statistics">
                                <Route index element={<StatisticsIndex />} />
                            </Route>
                        </Route>
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
