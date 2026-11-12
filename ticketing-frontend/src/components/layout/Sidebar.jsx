import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

export default function Sidebar() {
    const { isAdmin, isAgent, isCustomer } = useAuth();

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon">📊</span>
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/tickets" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon">🎫</span>
                    <span>Tickets</span>
                </NavLink>

                {isCustomer && (
                    <NavLink to="/tickets/new" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <span className="sidebar-icon">➕</span>
                        <span>New Ticket</span>
                    </NavLink>
                )}

                {isAdmin && (
                    <>
                        <div className="sidebar-divider"></div>
                        <div className="sidebar-section-title">Admin</div>

                        <NavLink to="/admin/categories" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="sidebar-icon">📁</span>
                            <span>Categories</span>
                        </NavLink>

                        <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="sidebar-icon">👥</span>
                            <span>Users</span>
                        </NavLink>
                    </>
                )}
            </nav>
        </aside>
    );
}