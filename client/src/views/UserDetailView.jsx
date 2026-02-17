import React from 'react';
import './UserDetailView.css';

const UserDetailView = ({ user, isOpen, onClose }) => {
    if (!user) return null;

    return (
        <div className={`detail-panel ${isOpen ? 'open' : ''}`}>
            <div className="detail-header">
                <h2>User Details</h2>
                <button className="btn-close" onClick={onClose}>&times;</button>
            </div>

            <div className="detail-content">
                <div className="detail-avatar-section">
                    <div className="large-avatar">
                        {user.name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                    </div>
                    <h3>{user.name}</h3>
                    <span className={`badge role-${user.role?.toLowerCase()}`}>{user.role}</span>
                </div>

                <div className="detail-info-grid">
                    <div className="detail-item">
                        <label>Email Address</label>
                        <p>{user.email}</p>
                    </div>
                    <div className="detail-item">
                        <label>Phone Number</label>
                        <p>{user.phone || 'Not provided'}</p>
                    </div>
                    <div className="detail-item">
                        <label>Current Status</label>
                        <p><span className={`badge status-${user.status?.toLowerCase()}`}>{user.status}</span></p>
                    </div>
                    <div className="detail-item">
                        <label>Joined On</label>
                        <p>{new Date(user.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    </div>
                    <div className="detail-item">
                        <label>Last Updated</label>
                        <p>{new Date(user.updatedAt).toLocaleString()}</p>
                    </div>
                    <div className="detail-item">
                        <label>User ID</label>
                        <p className="monospace">{user._id}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailView;
