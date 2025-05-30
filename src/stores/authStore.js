import { defineStore } from "pinia";
import { ref } from "vue";
import authService from "../services/authService.js";
import * as jwt_decode from "jwt-decode";

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

    const isLoggedIn = () => !!token.value;

    const loggedInUser = () => (token.value ? jwt_decode(token.value) : null);

    return { token, login, logout, isLoggedIn, loggedInUser };
});
