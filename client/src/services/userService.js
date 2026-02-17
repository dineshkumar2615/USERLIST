const API_URL = import.meta.env.VITE_API_URL;

const userService = {
    async getUsers(filters = {}) {
        const query = new URLSearchParams(filters).toString();
        const url = query ? `${API_URL}?${query}` : API_URL;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
    },
    async seedUsers() {
        const response = await fetch(`${API_URL}/seed`, { method: 'POST' });
        if (!response.ok) throw new Error('Failed to seed database');
        return await response.json();
    },
    async bulkDelete(ids) {
        const response = await fetch(`${API_URL}/bulk`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids }),
        });
        if (!response.ok) throw new Error('Failed to perform bulk delete');
        return await response.json();
    },
    async exportUsers() {
        window.location.href = `${API_URL}/export`;
    },
    async updateUserStatus(id, status) {
        const response = await fetch(`${API_URL}/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) throw new Error('Failed to update status');
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
