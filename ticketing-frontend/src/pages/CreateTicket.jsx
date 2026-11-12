import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import './CreateTicket.css';

export default function CreateTicket() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        priority: 'medium',
    });

    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get(ENDPOINTS.CATEGORIES);
            setCategories(response.data.categories);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await api.post(ENDPOINTS.TICKETS, formData);
            navigate(`/tickets/${response.data.ticket.id}`);
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                setErrors({ general: 'Something went wrong. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-ticket">
            <Link to="/tickets" className="back-link">
                ← Back to Tickets
            </Link>

            <div className="page-header">
                <h1>Create New Ticket</h1>
                <p className="text-muted">Describe your issue and we'll help you</p>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit} className="ticket-form">
                    {errors.general && (
                        <div className="alert alert-error">{errors.general}</div>
                    )}

                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Brief description of the issue"
                            required
                        />
                        {errors.title && (
                            <span className="form-error">{errors.title[0]}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Explain the issue in detail..."
                            rows="6"
                            required
                        />
                        {errors.description && (
                            <span className="form-error">{errors.description[0]}</span>
                        )}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category_id">Category *</label>
                            <select
                                id="category_id"
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <span className="form-error">{errors.category_id[0]}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority">Priority</label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                            {errors.priority && (
                                <span className="form-error">{errors.priority[0]}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-actions">
                        <Link to="/tickets" className="btn btn-ghost">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}