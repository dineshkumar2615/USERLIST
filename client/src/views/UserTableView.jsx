import React from 'react';
import './UserTableView.css';

const UserTableView = ({
    users, stats, filters, pagination, selectedIds,
    onAddClick, onEditClick, onDeleteClick, onFilterChange,
    onPageChange, onSelectUser, onSelectAll, onBulkDelete, onSeedData,
    onExport, onStatusToggle, onUserView
}) => {
    const handleStatusClick = (user) => {
        const statuses = ['Active', 'Inactive', 'Pending'];
        const nextIndex = (statuses.indexOf(user.status) + 1) % statuses.length;
        onStatusToggle(user, statuses[nextIndex]);
    };

    // Calculate distribution for progress bars
    const activePercent = stats.total > 0 ? (stats.active / stats.total) * 100 : 0;
    const adminPercent = stats.total > 0 ? (stats.admins / stats.total) * 100 : 0;

    return (
        <div className="user-table-container">
            <div className="dashboard-header">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-value">{stats.total}</p>
                    <div className="progress-bg"><div className="progress-bar" style={{ width: '100%', background: '#3b82f6' }}></div></div>
                </div>
                <div className="stat-card">
                    <h3>Active Users</h3>
                    <p className="stat-value active">{stats.active}</p>
                    <div className="progress-bg"><div className="progress-bar status-active" style={{ width: `${activePercent}%` }}></div></div>
                </div>
                <div className="stat-card">
                    <h3>Admins</h3>
                    <p className="stat-value admin">{stats.admins}</p>
                    <div className="progress-bg"><div className="progress-bar role-admin" style={{ width: `${adminPercent}%` }}></div></div>
                </div>
            </div>

            <div className="table-controls">
                <div className="search-box">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search by name or email..."
                        value={filters.search}
                        onChange={onFilterChange}
                    />
                </div>

                <div className="toolbar-actions">
                    <div className="bulk-actions">
                        {selectedIds.length > 0 && (
                            <button className="btn-bulk-delete" onClick={onBulkDelete}>
                                🗑️ Delete ({selectedIds.length})
                            </button>
                        )}
                    </div>
                    <div className="filter-group">
                        <select name="role" value={filters.role} onChange={onFilterChange}>
                            <option value="All">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="User">User</option>
                        </select>
                        <select name="status" value={filters.status} onChange={onFilterChange}>
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                    {stats.total === 0 && (
                        <button className="btn-seed" onClick={onSeedData} title="Seed Sample Data">🌱 Seed Data</button>
                    )}
                    <button className="btn-export" onClick={onExport} title="Export to CSV">📥 Export</button>
                    <button className="btn-add" onClick={onAddClick}>➕ Add User</button>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th className="checkbox-col">
                                <input
                                    type="checkbox"
                                    onChange={onSelectAll}
                                    checked={users.length > 0 && selectedIds.length === users.length}
                                />
                            </th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr><td colSpan="6" className="no-data">No users found. {stats.total === 0 && 'Try seeding test data.'}</td></tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id} className={selectedIds.includes(user._id) ? 'selected' : ''}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(user._id)}
                                            onChange={() => onSelectUser(user._id)}
                                        />
                                    </td>
                                    <td>
                                        <span className="user-name">
                                            {user.name}
                                        </span>
                                    </td>
                                    <td>{user.email}</td>
                                    <td><span className={`badge role-${user.role?.toLowerCase()}`}>{user.role || 'User'}</span></td>
                                    <td>
                                        <span
                                            className={`badge status-${user.status?.toLowerCase()} status-clickable`}
                                            onClick={() => handleStatusClick(user)}
                                            title="Click to toggle status"
                                        >
                                            {user.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="actions">
                                        <button className="btn-edit" onClick={() => onEditClick(user)}>Edit</button>
                                        <button className="btn-delete" onClick={() => onDeleteClick(user._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {pagination.totalPages > 1 && (
                    <div className="pagination-container">
                        <div className="pagination-info">
                            Showing page <span>{pagination.currentPage}</span> of <span>{pagination.totalPages}</span>
                        </div>
                        <div className="pagination-actions">
                            <button
                                className="pagination-btn nav-btn"
                                disabled={pagination.currentPage === 1}
                                onClick={() => onPageChange(pagination.currentPage - 1)}
                            >
                                ← Previous
                            </button>
                            <div className="pagination-numbers">
                                {[...Array(pagination.totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        className={`pagination-btn num-btn ${pagination.currentPage === i + 1 ? 'active' : ''}`}
                                        onClick={() => onPageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                className="pagination-btn nav-btn"
                                disabled={pagination.currentPage === pagination.totalPages}
                                onClick={() => onPageChange(pagination.currentPage + 1)}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserTableView;
