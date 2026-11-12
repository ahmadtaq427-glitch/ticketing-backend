import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import './NotificationsDropdown.css';

export default function NotificationsDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // جلب عدد الإشعارات غير المقروءة
    const fetchUnreadCount = async () => {
        try {
            const response = await api.get(ENDPOINTS.UNREAD_COUNT);
            setUnreadCount(response.data.count);
        } catch (err) {
            console.error(err);
        }
    };

    // جلب كل الإشعارات
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await api.get(ENDPOINTS.NOTIFICATIONS);
            setNotifications(response.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // إغلاق القائمة عند النقر برّاها
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // جلب العدد كل 30 ثانية
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleToggle = () => {
        if (!isOpen) {
            fetchNotifications();
        }
        setIsOpen(!isOpen);
    };

    const handleMarkAsRead = async (id) => {
        try {
            await api.post(ENDPOINTS.MARK_READ(id));
            setNotifications(notifications.map(n => 
                n.id === id ? { ...n, read_at: new Date().toISOString(), is_read: true } : n
            ));
            setUnreadCount(Math.max(0, unreadCount - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await api.post(ENDPOINTS.MARK_ALL_READ);
            setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString(), is_read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // منع فتح الإشعار
        try {
            await api.delete(ENDPOINTS.NOTIFICATION(id));
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="notif-wrapper" ref={dropdownRef}>
            <button className="notif-bell" onClick={handleToggle}>
                🔔
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="notif-dropdown">
                    <div className="notif-header">
                        <h4>Notifications</h4>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllAsRead} className="notif-mark-all">
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="notif-list">
                        {loading ? (
                            <div className="notif-empty">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="notif-empty">No notifications yet 📭</div>
                        ) : (
                            notifications.map((notif) => (
                                <div 
                                    key={notif.id} 
                                    className={`notif-item ${!notif.is_read ? 'unread' : ''}`}
                                    onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                                >
                                    <div className="notif-content">
                                        <p>{notif.data.message}</p>
                                        <span className="notif-time">
                                            {new Date(notif.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="notif-actions">
                                        {notif.data.ticket_id && (
                                         <Link 
                                             to={`/tickets/${notif.data.ticket_id}`} 
                                              className="notif-link" 
                                              onClick={(e) => {
                                              e.stopPropagation(); // يمنع ضغط الـ div
                                              if (!notif.is_read) handleMarkAsRead(notif.id); // يعلمو مقروء
                                              setIsOpen(false); // يسكر القائمة
                                                 }}
    >
                                          View
                                        </Link>
                                        )}
                                        <button onClick={(e) => handleDelete(e, notif.id)} className="notif-delete">✕</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}