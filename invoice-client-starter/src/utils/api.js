const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

let unauthorizedHandler = null;

export const setUnauthorizedHandler = (handler) => {
    unauthorizedHandler = handler;
};

const fetchData = async (url, requestOptions = {}, options = {}) => {
    const apiUrl = `${API_URL}${url}`;
    const response = await fetch(apiUrl, {
        credentials: "include",
        ...requestOptions,
    });

    const contentType = response.headers.get("content-type") || "";
    const isJsonResponse = contentType.includes("application/json");

    if (!response.ok) {
        const errorBody = isJsonResponse ? await response.json().catch(() => null) : await response.text().catch(() => "");
        const errorMessage = typeof errorBody === "string"
            ? errorBody
            : errorBody?.message || errorBody?.error || response.statusText;

        if (response.status === 401 && !options.skipAuthRedirect && unauthorizedHandler) {
            unauthorizedHandler();
        }

        const error = new Error(`Network response was not ok: ${response.status} ${response.statusText}${errorMessage ? ` - ${errorMessage}` : ""}`);
        error.status = response.status;
        error.body = errorBody;
        throw error;
    }

    if (response.status === 204) {
        return null;
    }

    if (isJsonResponse) {
        return response.json();
    }

    return response.text();
};

export const apiGet = (url, params, options) => {
    const filteredParams = Object.fromEntries(
        Object.entries(params || {}).filter(([_, value]) => value != null)
    );

    const queryString = new URLSearchParams(filteredParams).toString();
    // Změna: Přidáme '?' a parametry pouze pokud queryString není prázdný
    const finalUrl = queryString ? `${url}?${queryString}` : url;

    const requestOptions = {
        method: "GET",
    };

    return fetchData(finalUrl, requestOptions, options);
};

export const apiPost = (url, data, options) => {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    };

    return fetchData(url, requestOptions, options);
};

export const apiPut = (url, data, options) => {
    const requestOptions = {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    };

    return fetchData(url, requestOptions, options);
};

export const apiDelete = (url, options) => {
    const requestOptions = {
        method: "DELETE",
    };

    return fetchData(url, requestOptions, options);
};
