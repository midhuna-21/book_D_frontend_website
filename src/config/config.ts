const config = {
    API_BACKEND: import.meta.env.VITE_API_BACKEND,
    API_URL: import.meta.env.VITE_API_URL || "https://www.bookd.store/api",
    USER_API_URL: import.meta.env.VITE_USER_API_URL,
    ADMIN_API_URL: import.meta.env.VITE_ADMIN_API_URL,
    GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
};

export default config;
