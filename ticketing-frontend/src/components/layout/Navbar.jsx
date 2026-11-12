import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';
import NotificationsDropdown from './NotificationsDropdown';
export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout, isAdmin, isAgent, isCustomer } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getRoleLabel = () => {
        if (isAdmin) return 'Admin';
        if (isAgent) return 'Agent';
        if (isCustomer) return 'Customer';
        return '';
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">
                    <span className="navbar-logo">🎫</span>
                    <span className="navbar-title">Ticketing System</span>
                </Link>
            </div>

            <div className="navbar-user">
                  <NotificationsDropdown />
                <div className="navbar-user-info">
                    <span className="navbar-user-name">{user?.name}</span>
                    <span className={`navbar-user-role role-${user?.role}`}>
                        {getRoleLabel()}
                    </span>
                </div>
                <button onClick={handleLogout} className="btn-logout">
                    Logout
                </button>
            </div>
        </nav>
    );
}