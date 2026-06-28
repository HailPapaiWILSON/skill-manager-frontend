import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor para adicionar o token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        `📤 ${config.method?.toUpperCase() || "GET"} ${config.url} - ✅ Token anexado`,
      );
    } else {
      console.log(
        `📤 ${config.method?.toUpperCase() || "GET"} ${config.url} - ⚠️ Sem token`,
      );
    }
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor para 401
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `📥 ${response.config.method?.toUpperCase() || "GET"} ${response.config.url} - ${response.status}`,
    );
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log("🔒 401 - Token expirado ou inválido");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Evita redirecionamento infinito
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/cadastro")
      ) {
        console.log("🔒 Redirecionando para login...");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
