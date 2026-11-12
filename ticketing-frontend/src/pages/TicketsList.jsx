import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import './TicketsList.css';

export default function TicketsList() {
    const { isCustomer, isAdmin } = useAuth();

    const [tickets, setTickets] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchTickets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, status, priority]);

    const fetchTickets = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = { page };
            if (search) params.search = search;
            if (status) params.status = status;
            if (priority) params.priority = priority;

            const response = await api.get(ENDPOINTS.TICKETS, { params });
            setTickets(response.data.data);
            setMeta(response.data.meta);
        } catch (err) {
            setError('Failed to load tickets');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchTickets();
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatus('');
        setPriority('');
        setPage(1);
    };

    const hasFilters = search || status || priority;

    return (
        <div className="tickets-page">
            <div className="page-header">
                <div>
                    <h1>Tickets</h1>
                    <p className="text-muted">
                        {meta ? `${meta.total} ticket(s) found` : 'Loading...'}
                    </p>
                </div>

                {isCustomer && (
                    <Link to="/tickets/new" className="btn btn-primary">
                        + New Ticket
                    </Link>
                )}
            </div>

            {/* Filters Bar */}
            <div className="filters-bar">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search by title or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="btn btn-secondary">
                        Search
                    </button>
                </form>

                <div className="filters-group">
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                        className="filter-select"
                    >
                        <option value="">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>

                    <select
                        value={priority}
                        onChange={(e) => {
                            setPriority(e.target.value);
                            setPage(1);
                        }}
                        className="filter-select"
                    >
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>

                    {hasFilters && (
                        <button onClick={handleClearFilters} className="btn btn-ghost">
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="page-loader-small">
                    <div className="spinner"></div>
                </div>
            ) : error ? (
                <div className="alert alert-error">{error}</div>
            ) : tickets.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No tickets found</h3>
                    <p className="text-muted">
                        {hasFilters ? 'Try adjusting your filters' : 'Tickets will appear here'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="tickets-list">
                        {tickets.map((ticket) => (
                            <TicketRow key={ticket.id} ticket={ticket} />
                        ))}
                    </div>

                    <Pagination meta={meta} onPageChange={setPage} />
                </>
            )}
        </div>
    );
}

/* ============ Ticket Row ============ */
function TicketRow({ ticket }) {
    return (
        <Link to={`/tickets/${ticket.id}`} className="ticket-row">
            <div className="ticket-row-main">
                <div className="ticket-row-header">
                    <span className="ticket-id">#{ticket.id}</span>
                    <h3 className="ticket-title">{ticket.title}</h3>
                </div>
                <p className="ticket-description">{ticket.description}</p>
                <div className="ticket-row-meta">
                    <span className={`badge badge-${ticket.status}`}>
                        {ticket.status.replace('_', ' ')}
                    </span>
                    <span className={`badge badge-${ticket.priority}`}>
                        {ticket.priority}
                    </span>
                    {ticket.category && (
                        <span className="ticket-category">📁 {ticket.category.name}</span>
                    )}
                    {ticket.agent && (
                        <span className="ticket-agent">🎧 {ticket.agent.name}</span>
                    )}
                </div>
            </div>
            <div className="ticket-row-date">
                {new Date(ticket.created_at).toLocaleDateString()}
            </div>
        </Link>
    );
}

/* ============ Pagination ============ */
function Pagination({ meta, onPageChange }) {
    if (!meta || meta.last_page <= 1) return null;

    const pages = [];
    for (let i = 1; i <= meta.last_page; i++) {
        pages.push(i);
    }

    return (
        <div className="pagination">
            <button
                onClick={() => onPageChange(meta.current_page - 1)}
                disabled={meta.current_page === 1}
                className="pagination-btn"
            >
                ← Prev
            </button>

            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`pagination-btn ${p === meta.current_page ? 'active' : ''}`}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => onPageChange(meta.current_page + 1)}
                disabled={meta.current_page === meta.last_page}
                className="pagination-btn"
            >
                Next →
            </button>
        </div>
    );
}