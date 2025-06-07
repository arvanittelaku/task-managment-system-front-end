import { defineStore } from "pinia";
import { ref, computed } from "vue";
import authService from "../services/authService.js";
import {jwtDecode} from "jwt-decode";

export const useAuthStore = defineStore("auth", () => {
    const token = ref(localStorage.getItem("token") || null);

    const login = async (user) => {
        try {
            const data = await authService.login(user);
            if (data && data.token) {
                token.value = data.token;
                localStorage.setItem("token", data.token);
            } else {
                throw new Error("No token received");
            }
        } catch (err) {
            console.error("Login failed:", err);
            throw err;
        }
    };

    const logout = () => {
        token.value = null;
        localStorage.removeItem("token");
    };

    const isLoggedIn = computed(() => !!token.value);

    const loggedInUser = computed(() => {
        try {
            return token.value ? jwtDecode(token.value) : null;
        } catch (e) {
            return null;
        }
    });

    return { token, login, logout, isLoggedIn, loggedInUser };
});
