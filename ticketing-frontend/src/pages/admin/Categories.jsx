import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import './Categories.css';
import { useToast } from '../../context/ToastContext';
export default function Categories() {
    const { addToast } = useToast();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_active: true,
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get(ENDPOINTS.CATEGORIES);
            setCategories(response.data.categories);
        } catch (err) {
            setError('Failed to load categories');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description || '',
                is_active: category.is_active,
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '', is_active: true });
        }
        setFormErrors({});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '', is_active: true });
        setFormErrors({});
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors({});

        try {
            if (editingCategory) {
                await api.put(ENDPOINTS.CATEGORY(editingCategory.id), formData);
            } else {
                await api.post(ENDPOINTS.CATEGORIES, formData);
            }
           await fetchCategories();
           addToast(editingCategory ? 'Category updated successfully' : 'Category created successfully', 'success');
           closeModal();
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

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

         try {
       await api.delete(ENDPOINTS.CATEGORY(id));
       setCategories(categories.filter((c) => c.id !== id));
       addToast('Category deleted successfully', 'success');
    } catch (err) {
    console.error(err);
    addToast('Cannot delete this category. It may be in use.', 'error');
     }
    };

    if (loading) {
        return (
            <div className="page-loader">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="categories-page">
            <div className="page-header">
                <div>
                    <h1>Categories</h1>
                    <p className="text-muted">Manage ticket categories</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    + New Category
                </button>
            </div>

            {error ? (
                <div className="alert alert-error">{error}</div>
            ) : (
                <div className="card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => (
                                <tr key={cat.id}>
                                    <td className="font-medium">{cat.name}</td>
                                    <td className="text-muted">{cat.description || '—'}</td>
                                    <td>
                                        <span className={`badge ${cat.is_active ? 'badge-resolved' : 'badge-closed'}`}>
                                            {cat.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button onClick={() => openModal(cat)} className="btn-icon" title="Edit">
                                                ✏️
                                            </button>
                                            <button onClick={() => handleDelete(cat.id)} className="btn-icon btn-icon-danger" title="Delete">
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingCategory ? 'Edit Category' : 'New Category'}</h2>
                            <button onClick={closeModal} className="modal-close">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-body">
                            {formErrors.general && (
                                <div className="alert alert-error">{formErrors.general}</div>
                            )}

                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Bug"
                                    required
                                />
                                {formErrors.name && <span className="form-error">{formErrors.name[0]}</span>}
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Optional description..."
                                    rows="3"
                                />
                                {formErrors.description && <span className="form-error">{formErrors.description[0]}</span>}
                            </div>

                            <div className="form-group form-checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                    />
                                    <span>Active (visible for new tickets)</span>
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={closeModal} className="btn btn-ghost">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}