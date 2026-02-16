import React, { useState, useEffect } from 'react';
import UserTableView from '../views/UserTableView';
import UserModalView from '../views/UserModalView';
import userService from '../services/userService';
import User from '../models/User';

const UserController = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const data = await userService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Failed to refresh user list: ' + error.message);
        }
    };

    const handleAddClick = () => {
        setIsEditMode(false);
        setFormData({ name: '', email: '' });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleEditClick = (user) => {
        setIsEditMode(true);
        setCurrentUser(user);
        setFormData({ name: user.name, email: user.email });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validation = User.validate(formData.name, formData.email);
        if (!validation.isValid) { setErrors(validation.errors); return; }

        try {
            if (isEditMode) {
                await userService.updateUser(currentUser._id, formData);
            } else {
                await userService.createUser(formData);
            }
            fetchUsers();
            setIsModalOpen(false);
        } catch (error) { alert(error.message); }
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.deleteUser(id);
                alert('User deleted successfully!');
                fetchUsers();
            } catch (error) {
                console.error('Delete error:', error);
                alert('Failed to delete user: ' + error.message);
            }
        }
    };

    return (
        <>
            <UserTableView users={users} onAddClick={handleAddClick} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
            <UserModalView isOpen={isModalOpen} isEditMode={isEditMode} formData={formData} errors={errors} onClose={() => setIsModalOpen(false)} onChange={handleChange} onSubmit={handleSubmit} />
        </>
    );
};
export default UserController;
