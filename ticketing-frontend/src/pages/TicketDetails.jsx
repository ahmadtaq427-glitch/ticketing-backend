
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import './TicketDetails.css';
import AttachmentsSection from '../components/tickets/AttachmentsSection';
import { useToast } from '../context/ToastContext';
export default function TicketDetails() {
    const { addToast } = useToast();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAdmin, isAgent, isCustomer } = useAuth();

    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Comment form
    const [commentBody, setCommentBody] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    // Agents list (للـ admin)
    const [agents, setAgents] = useState([]);

    useEffect(() => {
    fetchTicket();
    fetchComments();
    if (isAdmin) {
        fetchAgents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [id]);

const fetchAgents = async () => {
    try {
        const response = await api.get(ENDPOINTS.AGENTS);
        setAgents(response.data.agents);
    } catch (err) {
        console.error(err);
    }
};
    const fetchTicket = async () => {
        try {
            const response = await api.get(ENDPOINTS.TICKET(id));
            setTicket(response.data.ticket);
        } catch (err) {
            setError('Ticket not found');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await api.get(ENDPOINTS.TICKET_COMMENTS(id));
            setComments(response.data.comments);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentBody.trim()) return;

        setSubmittingComment(true);
        try {
            const response = await api.post(ENDPOINTS.TICKET_COMMENTS(id), {
                body: commentBody,
            });
            setComments([...comments, response.data.comment]);
            setCommentBody('');
        } catch (err) {
            console.error(err);
            alert('Failed to add comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const response = await api.put(ENDPOINTS.TICKET(id), { status: newStatus });
            setTicket(response.data.ticket);
        } catch (err) {
            console.error(err);
           addToast('Failed to update status', 'error');
        }
    };

    const handleAssign = async (agentId) => {
        try {
            const response = await api.post(ENDPOINTS.ASSIGN_TICKET(id), {
                agent_id: agentId,
            });
            setTicket(response.data.ticket);
        } catch (err) {
            console.error(err);
            addToast('Failed to assign ticket', 'error');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this ticket?')) return;

        try {
            await api.delete(ENDPOINTS.TICKET(id));
            navigate('/tickets');
        } catch (err) {
            console.error(err);
          addToast('Failed to delete ticket', 'error');

        }
    };

    const canUpdateStatus = isAdmin || (isAgent && ticket?.agent_id === user?.id);

    if (loading) {
        return (
            <div className="page-loader">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="alert alert-error">
                {error || 'Ticket not found'}
                <Link to="/tickets" style={{ marginLeft: 16 }}>
                    ← Back to Tickets
                </Link>
            </div>
        );
    }

    return (
        <div className="ticket-details">
            {/* Back link */}
            <Link to="/tickets" className="back-link">
                ← Back to Tickets
            </Link>

            {/* Header */}
            <div className="ticket-details-header">
                <div className="ticket-details-title">
                    <span className="ticket-id">#{ticket.id}</span>
                    <h1>{ticket.title}</h1>
                </div>
                {isAdmin && (
                    <button onClick={handleDelete} className="btn btn-danger">
                        Delete
                    </button>
                )}
            </div>

            {/* Meta badges */}
            <div className="ticket-details-badges">
                <span className={`badge badge-${ticket.status}`}>
                    {ticket.status.replace('_', ' ')}
                </span>
                <span className={`badge badge-${ticket.priority}`}>
                    {ticket.priority}
                </span>
                {ticket.category && (
                    <span className="badge badge-neutral">📁 {ticket.category.name}</span>
                )}
            </div>

            {/* Body */}
            <div className="ticket-details-grid">
                <div className="ticket-details-main">
                    {/* Description */}
                    <div className="card">
                        <h3>Description</h3>
                        <p>{ticket.description}</p>
                    </div>

                    {/* Attachments */}
           <AttachmentsSection
                ticketId={ticket.id}
                initialAttachments={ticket.attachments || []}
                />

                    {/* Comments */}
                    <div className="card">
                        <h3>Comments ({comments.length})</h3>

                        <div className="comments-list">
                            {comments.length === 0 ? (
                                <p className="text-muted">No comments yet.</p>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="comment-item">
                                        <div className="comment-header">
                                            <div className="comment-author">
                                                <div className="comment-avatar">
                                                    {comment.user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="comment-author-name">
                                                        {comment.user.name}
                                                    </div>
                                                    <div className="comment-date">
                                                        {new Date(comment.created_at).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="comment-body">{comment.body}</div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add comment form */}
                        <form onSubmit={handleAddComment} className="comment-form">
                            <textarea
                                value={commentBody}
                                onChange={(e) => setCommentBody(e.target.value)}
                                placeholder="Write a comment..."
                                rows="3"
                                required
                            />
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submittingComment || !commentBody.trim()}
                            >
                                {submittingComment ? 'Posting...' : 'Post Comment'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="ticket-details-sidebar">
                    {/* Info */}
                    <div className="card">
                        <h3>Details</h3>
                        <div className="info-list">
                            <InfoRow label="Customer" value={ticket.customer?.name} />
                            <InfoRow label="Agent" value={ticket.agent?.name || 'Unassigned'} />
                            <InfoRow label="Category" value={ticket.category?.name} />
                            <InfoRow
                                label="Created"
                                value={new Date(ticket.created_at).toLocaleString()}
                            />
                            <InfoRow
                                label="Updated"
                                value={new Date(ticket.updated_at).toLocaleString()}
                            />
                        </div>
                    </div>

                    {/* Status change */}
                    {canUpdateStatus && (
                        <div className="card">
                            <h3>Change Status</h3>
                            <select
                                value={ticket.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="status-select"
                            >
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    )}

                    {/* Assign (Admin only) */}
                    {isAdmin && (
                        <div className="card">
                            <h3>Assign to Agent</h3>
                            <select
                                value={ticket.agent_id || ''}
                                onChange={(e) => handleAssign(e.target.value)}
                                className="status-select"
                            >
                                <option value="">— Unassigned —</option>
                                {agents.map((agent) => (
                                    <option key={agent.id} value={agent.id}>
                                        {agent.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ============ Info Row ============ */
function InfoRow({ label, value }) {
    return (
        <div className="info-row">
            <span className="info-label">{label}</span>
            <span className="info-value">{value || '—'}</span>
        </div>
    );



}

    
