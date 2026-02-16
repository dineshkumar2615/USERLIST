import React from 'react';
import './UserTableView.css';

const UserTableView = ({ users, onAddClick, onEditClick, onDeleteClick }) => {
    return (
        <div className="user-table-container">
            <div className="table-header">
                <h1>User Management</h1>
                <button className="btn-add" onClick={onAddClick}>+ Add User</button>
            </div>
            <div className="table-wrapper">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr><td colSpan="3" className="no-data">No users found. Click "Add User" to create one.</td></tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td className="actions">
                                        <button className="btn-edit" onClick={() => onEditClick(user)}>Edit</button>
                                        <button className="btn-delete" onClick={() => onDeleteClick(user._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default UserTableView;
