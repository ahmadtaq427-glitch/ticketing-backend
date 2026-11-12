export const ENDPOINTS = {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    ME: '/me',

    CATEGORIES: '/categories',
    CATEGORY: (id) => `/categories/${id}`,

    TICKETS: '/tickets',
    TICKET: (id) => `/tickets/${id}`,
    ASSIGN_TICKET: (id) => `/tickets/${id}/assign`,

    TICKET_COMMENTS: (ticketId) => `/tickets/${ticketId}/comments`,
    COMMENT: (id) => `/comments/${id}`,

    TICKET_ATTACHMENTS: (ticketId) => `/tickets/${ticketId}/attachments`,
    COMMENT_ATTACHMENTS: (commentId) => `/comments/${commentId}/attachments`,
    ATTACHMENT: (id) => `/attachments/${id}`,

    NOTIFICATIONS: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    NOTIFICATION: (id) => `/notifications/${id}`,
    AGENTS: '/agents',
    DASHBOARD_STATS: '/dashboard/stats',
    ADMIN_USERS: '/admin/users',
    ADMIN_CREATE_AGENT: '/admin/users/agent',
};