import {defineStore} from "pinia";
import taskService from "../services/taskService.js";

export const useTaskStore = defineStore('task', {
    state: () => ({
        tasks: [],
        loading: false,
        error: null
    }),
    actions: {
        async getTasks() {
            this.loading = true;
            this.error = null;
            try {
                this.tasks = await taskService.getTasksForCurrentUser();
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async createTask(task) {
            this.loading = true;
            this.error = null;
            try {
                await taskService.createTask(task);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async updateTask(task) {
            this.loading = true;
            this.error = null;
            try {
                await taskService.updateTask(task);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async deleteTask(id) {
            this.loading = true;
            this.error = null;
            try {
                await taskService.deleteTask(id);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async getTaskById(id) {
            this.loading = true;
            this.error = null;
            try {
                this.task = await taskService.getTaskById(id);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async updateTaskStatus(task) {
            this.loading = true;
            this.error = null;
            try {
                await taskService.updateTaskStatus(task);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async assignTask(task) {
            this.loading = true;
            this.error = null;
            try {
                await taskService.assignTask(task);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
    }
});
