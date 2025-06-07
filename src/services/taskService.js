import client from "../helpers/client.js";

class TaskService {
    async getAllTasks() {
        const response = await client.get('/tasks');
        return response.data;
    }

    async getTasksForCurrentUser() {
        const response = await client.get('/tasks/my-tasks');
        console.log("API response for tasks:", response);
        return response.data;
    }

    async createTask(task) {
        const response = await client.post('/tasks', task);
        return response.data;
    }

    async updateTask(task) {
        const response = await client.put(`/tasks/${task.id}`, task);
        return response.data;
    }

    async deleteTask(id) {
        const response = await client.delete(`/tasks/${id}`);
        return response.data;
    }

    async getTaskById(id) {
        const response = await client.get(`/tasks/${id}`);
        return response.data;
    }

    async assignTask(taskId, userId) {
        const response = await client.post(`/tasks/assign/${taskId}/${userId}`);
        return response.data;
    }

    async updateTaskStatus(taskId, newStatus) {
        const response = await client.patch(`/tasks/${taskId}/status`, {
            status: newStatus
        });
        return response.data;
    }
}

export default new TaskService();
