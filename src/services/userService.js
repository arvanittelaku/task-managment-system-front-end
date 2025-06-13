import client from '../helpers/client';

class UserService {
    async registerUser(user) {
        const response = await client.post('/users/register/user', user);
        return response.data;
    }

    async getAllManagers() {
        const response = await client.get('/users/managers');
        return response.data;
    }

    async deleteUserById(id) {
        const response = await client.delete(`/users/${id}`);
        return response.data;
    }

    async getUserById(id) {
        const response = await client.get(`/users/${id}`);
        return response.data;
    }

    async getAllByRole(role) {
        const response = await client.get(`/users/by-role?role=${role}`);
        return response.data;
    }

    async registerManager(manager) {
        const response = await client.post('/users/register/manager', manager);
        return response.data;
    }

    async getUserByUsername(username) {
        // Use query param instead of path variable
        const response = await client.get(`/users/by-username`, {
            params: { username: username.trim() }
        });
        return response.data;
    }

    async updateUser(user) {
        const response = await client.put(`/users/${user.id}`, user);
        return response.data;
    }

    async getAllUsers() {
        const response = await client.get('/users');
        return response.data;
    }

    async getAllUsersByRole(role) {
        const response = await client.get(`/users/by-role?role=${role}`);
        return response.data;
    }

    async getUserByRole(role) {
        const response = await client.get(`/users/by-role?role=${role}`);
        return response.data;
    }

    async getCurrentUserProfile() {
        const response = await client.get('/users/me');
        return response.data;
    }
}

export default new UserService();
