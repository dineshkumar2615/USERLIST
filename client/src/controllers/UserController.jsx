import React, { useState, useEffect } from 'react';
import UserTableView from '../views/UserTableView';
import UserModalView from '../views/UserModalView';
import userService from '../services/userService';
import User from '../models/User';
import { toast } from 'react-hot-toast';

const UserController = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'User', status: 'Active' });
    const [errors, setErrors] = useState({});

    // Phase 2, 3 & 4 State
    const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1, totalUsers: 0 });
    const [selectedIds, setSelectedIds] = useState([]);
    const [filters, setFilters] = useState({ search: '', role: 'All', status: 'All', page: 1, limit: 10 });
    const [stats, setStats] = useState({ total: 0, active: 0, admins: 0 });

    useEffect(() => { fetchUsers(); }, [filters]);

    const fetchUsers = async () => {
        try {
            const data = await userService.getUsers(filters);
            const userList = Array.isArray(data) ? data : (data.users || []);
            setUsers(userList);

            if (Array.isArray(data)) {
                setPagination({
                    totalPages: 1,
                    currentPage: 1,
                    totalUsers: data.length
                });
                // Fallback for stats if backend doesn't provide it
                setStats({
                    total: data.length,
                    active: data.filter(u => u.status === 'Active').length,
                    admins: data.filter(u => u.role === 'Admin').length
                });
            } else {
                setPagination({
                    totalPages: data.totalPages || 1,
                    currentPage: data.currentPage || 1,
                    totalUsers: data.totalUsers || 0
                });
                if (data.globalStats) {
                    setStats(data.globalStats);
                }
            }
            setSelectedIds([]); // Reset selection on fetch
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to load users');
        }
    };

    const handleAddClick = () => {
        setIsEditMode(false);
        setFormData({ name: '', email: '', phone: '', role: 'User', status: 'Active' });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleEditClick = (user) => {
        setIsEditMode(true);
        setCurrentUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            role: user.role || 'User',
            status: user.status || 'Active'
        });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleStatusToggle = async (user, newStatus) => {
        try {
            await userService.updateUserStatus(user._id, newStatus);
            toast.success(`Status updated for ${user.name}`);
            fetchUsers();
        } catch (error) {
            toast.error('Status update failed');
        }
    };

    const handleExport = () => {
        userService.exportUsers();
        toast.success('Download started');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleSelectUser = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(users.map(u => u._id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} users?`)) {
            try {
                await userService.bulkDelete(selectedIds);
                toast.success('Users deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Bulk delete failed');
            }
        }
    };

    const handleSeedData = async () => {
        try {
            await userService.seedUsers();
            toast.success('Sample data loaded!');
            fetchUsers();
        } catch (error) {
            toast.error('Seeding failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validation = User.validate(formData.name, formData.email);
        if (!validation.isValid) { setErrors(validation.errors); return; }

        try {
            if (isEditMode) {
                await userService.updateUser(currentUser._id, formData);
                toast.success('User updated successfully');
            } else {
                await userService.createUser(formData);
                toast.success('User created successfully');
            }
            fetchUsers();
            setIsModalOpen(false);
        } catch (error) { toast.error(error.message); }
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.deleteUser(id);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                console.error('Delete error:', error);
                toast.error('Failed to delete user');
            }
        }
    };

    return (
        <>
            <UserTableView
                users={users}
                stats={stats}
                filters={filters}
                pagination={pagination}
                selectedIds={selectedIds}
                onAddClick={handleAddClick}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                onFilterChange={handleFilterChange}
                onPageChange={handlePageChange}
                onSelectUser={handleSelectUser}
                onSelectAll={handleSelectAll}
                onBulkDelete={handleBulkDelete}
                onSeedData={handleSeedData}
                onExport={handleExport}
                onStatusToggle={handleStatusToggle}
            />
            <UserModalView isOpen={isModalOpen} isEditMode={isEditMode} formData={formData} errors={errors} onClose={() => setIsModalOpen(false)} onChange={handleChange} onSubmit={handleSubmit} />
        </>
    );
};

export default UserController;
