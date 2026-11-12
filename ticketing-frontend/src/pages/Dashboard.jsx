import { useState, useEffect } from 'react';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
    const { user, isAdmin, isAgent, isCustomer } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get(ENDPOINTS.DASHBOARD_STATS);
                setStats(response.data);
            } catch (err) {
                setError('Failed to load dashboard data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="page-loader">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-error">{error}</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p className="text-muted">Welcome back, {user?.name}!</p>
            </div>

            {isAdmin && <AdminDashboard stats={stats} />}
            {isAgent && <AgentDashboard stats={stats} />}
            {isCustomer && <CustomerDashboard stats={stats} />}
        </div>
    );
}

/* ============ Admin Dashboard ============ */
function AdminDashboard({ stats }) {
    return (
        <>
            <section className="dashboard-section">
                <h2>Tickets Overview</h2>
                <div className="stats-grid">
                    <StatCard label="Total Tickets" value={stats.tickets.total} color="primary" icon="🎫" />
                    <StatCard label="Open" value={stats.tickets.open} color="info" icon="📬" />
                    <StatCard label="In Progress" value={stats.tickets.in_progress} color="warning" icon="⚙️" />
                    <StatCard label="Resolved" value={stats.tickets.resolved} color="success" icon="✅" />
                    <StatCard label="Closed" value={stats.tickets.closed} color="muted" icon="🔒" />
                </div>
            </section>

            <section className="dashboard-section">
                <h2>By Priority</h2>
                <div className="stats-grid">
                    {Object.entries(stats.by_priority).map(([priority, count]) => (
                        <StatCard
                            key={priority}
                            label={priority.charAt(0).toUpperCase() + priority.slice(1)}
                            value={count}
                            color={`priority-${priority}`}
                            icon="⚡"
                        />
                    ))}
                </div>
            </section>

            <section className="dashboard-section">
                <h2>By Category</h2>
                <div className="stats-grid">
                    {Object.entries(stats.by_category).map(([category, count]) => (
                        <StatCard key={category} label={category} value={count} color="info" icon="📁" />
                    ))}
                </div>
            </section>

            <section className="dashboard-section">
                <h2>Users</h2>
                <div className="stats-grid">
                    <StatCard label="Total Users" value={stats.users.total} color="primary" icon="👥" />
                    <StatCard label="Admins" value={stats.users.admins} color="danger" icon="👑" />
                    <StatCard label="Agents" value={stats.users.agents} color="info" icon="🎧" />
                    <StatCard label="Customers" value={stats.users.customers} color="success" icon="🙋" />
                </div>
            </section>

            {stats.recent_tickets && stats.recent_tickets.length > 0 && (
                <section className="dashboard-section">
                    <h2>Recent Tickets</h2>
                    <div className="recent-tickets">
                        {stats.recent_tickets.map((ticket) => (
                            <div key={ticket.id} className="recent-ticket-item">
                                <div className="recent-ticket-info">
                                    <div className="recent-ticket-title">{ticket.title}</div>
                                    <div className="recent-ticket-meta">
                                        <span className={`badge badge-${ticket.status}`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                        <span className={`badge badge-${ticket.priority}`}>
                                            {ticket.priority}
                                        </span>
                                    </div>
                                </div>
                                <div className="recent-ticket-date">
                                    {new Date(ticket.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}

/* ============ Agent Dashboard ============ */
function AgentDashboard({ stats }) {
    return (
        <>
            <section className="dashboard-section">
                <h2>My Tickets</h2>
                <div className="stats-grid">
                    <StatCard label="Assigned" value={stats.assigned_tickets} color="primary" icon="🎫" />
                    <StatCard label="In Progress" value={stats.in_progress} color="warning" icon="⚙️" />
                    <StatCard label="Resolved" value={stats.resolved} color="success" icon="✅" />
                    <StatCard label="Closed" value={stats.closed} color="muted" icon="🔒" />
                </div>
            </section>

            {stats.by_priority && Object.keys(stats.by_priority).length > 0 && (
                <section className="dashboard-section">
                    <h2>By Priority</h2>
                    <div className="stats-grid">
                        {Object.entries(stats.by_priority).map(([priority, count]) => (
                            <StatCard
                                key={priority}
                                label={priority.charAt(0).toUpperCase() + priority.slice(1)}
                                value={count}
                                color={`priority-${priority}`}
                                icon="⚡"
                            />
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}

/* ============ Customer Dashboard ============ */
function CustomerDashboard({ stats }) {
    return (
        <section className="dashboard-section">
            <h2>My Tickets</h2>
            <div className="stats-grid">
                <StatCard label="My Tickets" value={stats.my_tickets} color="primary" icon="🎫" />
                <StatCard label="Open" value={stats.open} color="info" icon="📬" />
                <StatCard label="In Progress" value={stats.in_progress} color="warning" icon="⚙️" />
                <StatCard label="Resolved" value={stats.resolved} color="success" icon="✅" />
                <StatCard label="Closed" value={stats.closed} color="muted" icon="🔒" />
            </div>
        </section>
    );
}

/* ============ Reusable StatCard ============ */
function StatCard({ label, value, color = 'primary', icon }) {
    return (
        <div className={`stat-card stat-card-${color}`}>
            <div className="stat-card-icon">{icon}</div>
            <div className="stat-card-content">
                <div className="stat-card-value">{value}</div>
                <div className="stat-card-label">{label}</div>
            </div>
        </div>
    );
}