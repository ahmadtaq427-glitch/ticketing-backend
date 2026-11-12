import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import TicketsList from './pages/TicketsList';
import TicketDetails from './pages/TicketDetails';
import CreateTicket from './pages/CreateTicket';
import Categories from './pages/admin/Categories';
import Users from './pages/admin/Users'; // ← ضفنا هاد

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes (أي مستخدم مسجل دخول) */}
                    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/tickets" element={<TicketsList />} />
                        <Route path="/tickets/new" element={<CreateTicket />} />
                        <Route path="/tickets/:id" element={<TicketDetails />} />
                        
                        {/* Admin Routes (محمية للأدمن بس) */}
                        <Route 
                            path="/admin/categories" 
                            element={
                                <ProtectedRoute roles={['admin']}>
                                    <Categories />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/admin/users" 
                            element={
                                <ProtectedRoute roles={['admin']}>
                                    <Users />
                                </ProtectedRoute>
                            } 
                        />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;