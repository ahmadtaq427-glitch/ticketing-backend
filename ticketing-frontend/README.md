# 🎫 Ticketing System - Frontend

A modern, responsive React frontend for a Help Desk / Ticketing System. Built with **React + Vite** and custom **CSS Design System** (no UI libraries). Connects to a Laravel REST API.

## 🚀 Tech Stack

- **Framework:** React 18 (Vite)
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Styling:** Custom CSS (Variables, Design System)
- **State Management:** Context API + Hooks

## ✨ Key Features

- **Authentication:** Secure login/register with JWT (Sanctum) tokens.
- **Role-Based UI:** Different dashboards and permissions for Admin, Agent, and Customer.
- **Dashboard:** Real-time stats and analytics.
- **Tickets:**
  - List with advanced search, filtering (Status/Priority), and pagination.
  - Detail view with comments and file attachments.
  - Create new tickets (Customers).
  - Assign to agents and change status (Admin/Agent).
- **Notifications:** Dropdown with unread count, mark as read, and direct links.
- **Admin Panel:** Manage Categories.
- **Toast Notifications:** Custom, non-blocking toast system for success/error messages.
- **Design:** Fully responsive, modern UI with custom CSS variables.

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ticketing-frontend.git
   cd ticketing-frontend