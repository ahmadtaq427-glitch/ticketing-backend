import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles = null }) {
    const { user, loading, isAuthenticated } = useAuth();

    // لسا عم نحمّل من localStorage
    if (loading) {
        return (
            <div className="page-loader">
                <div className="spinner"></div>
            </div>
        );
    }

    // مو مسجّل → يروح للـ login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // في roles محددة وما هو من ضمنها → يروح للصفحة الرئيسية
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}