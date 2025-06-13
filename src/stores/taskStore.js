        import {defineStore} from "pinia";
        import taskService from "../services/taskService";

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
                        this.tasks = await taskService.getAllTasks();
                    } catch (error) {
                        console.error("Failed to fetch tasks:", error);
                        this.tasks = [];
                        this.error = error.response?.data?.message || error.message || "An unknown error occurred.";
                    } finally {
                        this.loading = false;
                    }
                },

                async createTask(task) {
                    this.loading = true;
                    this.error = null;
                    try {
                        await taskService.createTask(task);
                        await this.getTasks();
                    } catch (error) {
                        console.error("Failed to create task:", error);
                        this.error = error.response?.data?.message || error.message || "Failed to create task.";
                    } finally {
                        this.loading = false;
                    }
                },

                async updateTask(task) {
                    this.loading = true;
                    this.error = null;
                    try {
                        await taskService.updateTask(task);
                        await this.getTasks();
                    } catch (error) {
                        console.error("Failed to update task:", error);
                        this.error = error.response?.data?.message || error.message || "Failed to update task.";
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
                        console.error("Failed to delete task:", error);
                        this.error = error.response?.data?.message || error.message || "Failed to delete task.";
                    } finally {
                        this.loading = false;
                    }
                },

                async getTaskById(id) {
                    this.loading = true;
                    this.error = null;
                    try {
                        this.currentTask = await taskService.getTaskById(id);
                    } catch (error) {
                        console.error("Failed to get task by ID:", error);
                        this.error = error.response?.data?.message || error.message || "Failed to retrieve task.";
                        this.currentTask = null;
                    } finally {
                        this.loading = false;
                    }
                },

                async updateTaskStatus(taskId, newStatus) {
                    this.loading = true;
                    this.error = null;
                    try {
                        await taskService.updateTaskStatus(taskId, newStatus);
                        await this.getTasks();
                    } catch (error) {
                        console.error("Failed to update task status:", error);
                        this.error = error.response?.data?.message || error.message || "Failed to update task status.";
                        throw error;
                    } finally {
                        this.loading = false;
                    }
                },

                clearCurrentTask() {
                    this.currentTask = null;
                    this.error = null;
                },
            },
        });