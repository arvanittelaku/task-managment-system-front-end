import client from "../helpers/client.js";

class AuthService {
    async login(user) {
        const response = await client.post('/auth/login', user);
        return response.data;
    }
}

export default new AuthService();
