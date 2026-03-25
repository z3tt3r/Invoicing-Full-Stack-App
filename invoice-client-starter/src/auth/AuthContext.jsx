import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost, setUnauthorizedHandler } from "../utils/api";

const AuthContext = createContext(null);

function AuthBoundary({ children }) {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [setupStatus, setSetupStatus] = useState({
        setupRequired: false,
        primaryAdminEmail: null,
        demoEmail: null,
        demoPassword: null,
    });

    const loadSetupStatus = async () => {
        const status = await apiGet("/api/setup/status", null, { skipAuthRedirect: true });
        setSetupStatus(status);
        return status;
    };

    const loadSession = async () => {
        const status = await loadSetupStatus();
        if (status.setupRequired) {
            setCurrentUser(null);
            return null;
        }

        try {
            const user = await apiGet("/api/auth/me", null, { skipAuthRedirect: true });
            setCurrentUser(user);
        } catch (error) {
            if (error.status === 401) {
                setCurrentUser(null);
                return null;
            }
            throw error;
        }
        return null;
    };

    useEffect(() => {
        let isMounted = true;

        setUnauthorizedHandler(() => {
            if (isMounted) {
                setCurrentUser(null);
                navigate(setupStatus.setupRequired ? "/setup" : "/login", { replace: true });
            }
        });

        loadSession()
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
            setUnauthorizedHandler(null);
        };
    }, [navigate, setupStatus.setupRequired]);

    const login = async (email, password, redirectTo = "/persons") => {
        const user = await apiPost("/api/auth/login", { email, password }, { skipAuthRedirect: true });
        setCurrentUser(user);
        await loadSetupStatus();
        navigate(redirectTo, { replace: true });
        return user;
    };

    const logout = async (redirectTo = "/login", navigationState = null) => {
        try {
            await apiPost("/api/auth/logout", {}, { skipAuthRedirect: true });
        } finally {
            setCurrentUser(null);
            navigate(redirectTo, { replace: true, state: navigationState });
        }
    };

    const value = useMemo(() => ({
        currentUser,
        isLoading,
        isAuthenticated: !!currentUser,
        setupStatus,
        login,
        logout,
        refreshSession: loadSession,
        refreshSetupStatus: loadSetupStatus,
    }), [currentUser, isLoading, setupStatus]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }) {
    return <AuthBoundary>{children}</AuthBoundary>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth musí být použit uvnitř AuthProvider.");
    }
    return context;
}
