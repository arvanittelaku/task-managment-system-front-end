import { defineStore } from "pinia";
import taskService from "../services/taskService.js";
import axios from "axios";

export const useTaskStore = defineStore("task", {
    state: () => ({
        tasks: [],
        currentTask: null,
        loading: false,
        error: null,
    }),
    actions: {
        async getTasks() {
            this.loading = true;
            this.error = null;
            try {
                const tasks = await taskService.getTasksForCurrentUser();
                if (Array.isArray(tasks)) {
                    this.tasks = tasks;
                } else if (tasks?.data && Array.isArray(tasks.data)) {
                    this.tasks = tasks.data;
                } else if (tasks?.tasks && Array.isArray(tasks.tasks)) {
                    this.tasks = tasks.tasks;
                } else {
                    this.tasks = [];
                }
            } catch (error) {
                this.error = error;
                this.tasks = [];
            } finally {
                this.loading = false;
            }
        },

        async getAllTasks() {
            this.loading = true;
            this.error = null;
            try {
                const tasks = await taskService.getAllTasks();
                this.tasks = Array.isArray(tasks) ? tasks : [];
            } catch (error) {
                this.error = error;
                this.tasks = [];
            } finally {
                this.loading = false;
            }
        },

        async getManagerTasks() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get("/api/tasks?createdBy=me");
                this.tasks = Array.isArray(response.data) ? response.data : [];
            } catch (error) {
                this.error = error;
                this.tasks = [];
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
                await this.getTasks();
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
                const response = await taskService.getTaskById(id);
                console.log("Fetched task by ID:", response);
                this.currentTask = response;
            } catch (error) {
                this.error = error;
                this.currentTask = null;
            } finally {
                this.loading = false;
            }
        },

        clearCurrentTask() {
            this.currentTask = null;
            this.error = null;
            this.loading = false;
        },

        async updateTaskStatus(taskId, newStatus) {
            this.loading = true;
            this.error = null;
            try {
                await taskService.updateTaskStatus(taskId, newStatus);
                await this.getTasks();
            } catch (error) {
                this.error = error;
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});
