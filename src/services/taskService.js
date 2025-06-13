import axiosInstance from "../helpers/client.js";
class TaskService {
    async getAllTasks() {
        const response = await axiosInstance.get("/tasks");
        return response.data;
    }

    async createTask(task) {
        const response = await axiosInstance.post("/tasks/create", task);
        return response.data;
    }

    async updateTask(task) {
        const response = await axiosInstance.put(`/tasks/${task.id}/update`, task);
        return response.data;
    }

    async deleteTask(id) {
        const response = await axiosInstance.delete(`/tasks/${id}`);
        return response.data;
    }

    async getTaskById(id) {
        const response = await axiosInstance.get(`/tasks/${id}`);
        return response.data;
    }

    async updateTaskStatus(taskId, newStatus) {
        const response = await axiosInstance.patch(`/tasks/${taskId}/status`, {
            status: newStatus,
        });
        return response.data;
    }
}

export default new TaskService();