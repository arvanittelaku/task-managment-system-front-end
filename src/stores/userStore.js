import { defineStore } from 'pinia';
import userService from '../services/userService';

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
        currentUser: null,
        loading: false,
        error: null,
    }),

    actions: {
        async loadCurrentUser() {
            if (this.currentUser) return;
            this.loading = true;
            this.error = null;
            try {
                this.currentUser = await userService.getCurrentUserProfile();
            } catch (error) {
                this.error = error.response?.data?.message || error.message || 'Failed to load current user.';
                this.currentUser = null;
            } finally {
                this.loading = false;
            }
        },

        async getAllManagers() {
            this.loading = true;
            this.error = null;
            try {
                this.users = await userService.getAllManagers();
            } catch (error) {
                this.error = error.response?.data?.message || error.message || 'Failed to load managers.';
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
                this.error = error.response?.data?.message || error.message || 'Failed to load users by role.';
            } finally {
                this.loading = false;
            }
        },

        async registerUser(user) {
            this.loading = true;
            this.error = null;
            try {
                return await userService.registerUser(user);
            } catch (error) {
                this.error = error.response?.data?.message || error.message || 'Failed to register user.';
                return null;
            } finally {
                this.loading = false;
            }
        },

        async registerManager(manager) {
            this.loading = true;
            this.error = null;
            try {
                return await userService.registerManager(manager);
            } catch (error) {
                this.error = error.response?.data?.message || error.message || 'Failed to register manager.';
                return null;
            } finally {
                this.loading = false;
            }
        },

        async updateUser(user) {
            this.loading = true;
            this.error = null;
            try {
                return await userService.updateUser(user);
            } catch (error) {
                this.error = error.response?.data?.message || error.message || 'Failed to update user.';
                return null;
            } finally {
                this.loading = false;
            }
        },

        async getUserById(userId) {
            this.loading = true;
            this.error = null;
            try {
                return await userService.getUserById(userId);
            } catch (error) {
                this.error = error.response?.data?.message || error.message || 'Failed to load user.';
                return null;
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
                this.error = error.response?.data?.message || error.message || 'Delete failed.';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        canModifyUser(targetUser) {
            if (!this.currentUser || !targetUser) return false;

            if (this.currentUser.role === 'ADMIN') {
                return true;
            }
            if (this.currentUser.role === 'MANAGER') {
                return targetUser.createdByManagerId === this.currentUser.id;
            }
            return false;
        }
    }
});
