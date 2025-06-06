import { defineStore } from "pinia";
import userService from "../services/userService.js";

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
        currentUser: null,
        loading: false,
        error: null,
    }),

    actions: {
        async getAllManagers() {
            this.loading = true;
            this.error = null;
            try {
                this.users = await userService.getAllManagers();
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },

        async fetchUsersByRole(role) {
            this.loading = true;
            this.error = null;
            try {
                this.users = await userService.getAllByRole(role);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },

        async fetchUserById(userId) {
            this.loading = true;
            this.error = null;
            try {
                this.currentUser = await userService.getUserById(userId);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },

        async fetchUserByUsername(username) {
            this.loading = true;
            this.error = null;
            try {
                this.currentUser = await userService.getUserByUsername(username);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },

        async registerUser(user) {
            this.loading = true;
            this.error = null;
            try {
                await userService.registerUser(user);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },

        async registerManager(manager) {
            this.loading = true;
            this.error = null;
            try {
                await userService.registerManager(manager);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },

        async updateUser(user) {
            this.loading = true;
            this.error = null;
            try {
                await userService.updateUser(user);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },

        async deleteUserById(id) {
            this.loading = true;
            this.error = null;
            try {
                await userService.deleteUserById(id);
                this.users = this.users.filter(u => u.id !== id);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        }
    }
});
