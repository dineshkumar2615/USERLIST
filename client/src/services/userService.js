const API_URL = import.meta.env.VITE_API_URL;

const userService = {
    async getUsers() {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
    },
    async createUser(userData) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create user');
        }
        return await response.json();
    },
    async updateUser(id, userData) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update user');
        }
        return await response.json();
    },
    async deleteUser(id) {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete user');
        return await response.json();
    },
};
export default userService;
