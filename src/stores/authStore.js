import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../helpers/client.js";

export const useAuthStore = defineStore("auth", () => {
    const token = ref(localStorage.getItem("token") || null);
    const loading = ref(true);
    const user = ref(null);
    const initialized = ref(false);

    const login = async (userCredentials) => {
        try {
            loading.value = true;
            const response = await axiosInstance.post("/auth/login", userCredentials);
            const data = response.data;

            if (data?.token) {
                token.value = data.token;
                localStorage.setItem("token", data.token);
                decodeUser();
            } else {
                throw new Error("No token received after login.");
            }
        } catch (err) {
            console.error("Login failed:", err);
            logout();
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const decodeUser = () => {
        try {
            if (token.value) {
                const decoded = jwtDecode(token.value);
                user.value = {
                    id: decoded.id,
                    role: decoded.role,
                    username: decoded.username
                };
            } else {
                user.value = null;
            }
        } catch (err) {
            console.error("Failed to decode token:", err);
            logout();
        }
    };

    const logout = () => {
        token.value = null;
        user.value = null;
        localStorage.removeItem("token");
    };

    const isLoggedIn = computed(() => !!token.value && !!user.value);
    const role = computed(() => user.value?.role);
    const userId = computed(() => user.value?.id);
    const username = computed(() => user.value?.username);

    const initialize = async () => {
        loading.value = true;
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            token.value = storedToken;
            decodeUser();
        }
        loading.value = false;
        initialized.value = true;
    };

    return {
        token,
        login,
        logout,
        isLoggedIn,
        role,
        userId,
        username,
        initialize,
        loading,
        initialized
    };
});