import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import { useToast } from '../../context/ToastContext';
import './Users.css';

export default function Users() {
    const { addToast } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get(ENDPOINTS.ADMIN_USERS);
            setUsers(response.data.users);
        } catch (err) {
            addToast('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors({});

        try {
            await api.post(ENDPOINTS.ADMIN_CREATE_AGENT, formData);
            addToast('Agent created successfully', 'success');
            setFormData({ name: '', email: '', password: '' });
            setIsModalOpen(false);
            fetchUsers();
        } catch (err) {
            if (err.response?.status === 422) {
                setFormErrors(err.response.data.errors || {});
            } else {
                setFormErrors({ general: 'Something went wrong.' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (formErrors[e.target.name]) {
            setFormErrors({ ...formErrors, [e.target.name]: null });
        }
    };

    if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

    return (
        <div className="users-page">
            <div className="page-header">
                <div>
                    <h1>Users Management</h1>
                    <p className="text-muted">View all users and manage agents</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                    + Add Agent
                </button>
            </div>

            <div className="card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="font-medium">{user.name}</td>
                                <td className="text-muted">{user.email}</td>
                                <td>
                                    <span className={`badge badge-${user.role}`}>
                                        {user.role.toUpperCase()}
                                    </span>
                                </td>
                                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Agent Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add New Agent</h2>
                            <button onClick={() => setIsModalOpen(false)} className="modal-close">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-body">
                            {formErrors.general && <div className="alert alert-error">{formErrors.general}</div>}
                            
                            <div className="form-group">
                                <label>Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                                {formErrors.name && <span className="form-error">{formErrors.name[0]}</span>}
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                                {formErrors.email && <span className="form-error">{formErrors.email[0]}</span>}
                            </div>
                            <div className="form-group">
                                <label>Password *</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                                {formErrors.password && <span className="form-error">{formErrors.password[0]}</span>}
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Creating...' : 'Create Agent'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}