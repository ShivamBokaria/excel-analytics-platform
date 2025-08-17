# Excel Analytics Platform

A powerful MERN stack application for uploading, analyzing, and visualizing Excel data with role-based authentication and admin management.

## 🚀 Features Completed (Week 1)

### ✅ Authentication System
- **User Registration & Login** with JWT authentication
- **Role-based Access Control** (User/Admin roles)
- **Protected Routes** with authentication middleware
- **Password Security** using bcrypt hashing
- **Auto-login/logout** with token management

### ✅ Modern Dashboard
- **Responsive Design** with Tailwind CSS
- **User-friendly Interface** with statistics cards
- **Quick Actions** for upcoming features
- **Recent Activity** tracking
- **Development Progress** tracker
- **Role-specific Navigation** (Admin panel for admins)

### ✅ Admin Panel
- **Admin-only Access** with role verification
- **Pending Admin Approvals** management
- **Platform Statistics** overview
- **System Health** monitoring
- **Quick Admin Actions**

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS, React Router DOM
- **Backend**: Node.js, Express.js, JWT
- **Database**: MongoDB with Mongoose
- **Development**: Vite, Nodemon, Concurrently

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install Dependencies
```bash
# Install all dependencies (root, server, client)
npm run install-all
```

### 2. Environment Setup
```bash
# Create environment file in server directory
# Copy the following to server/.env:

PORT=5000
MONGO_URI=mongodb://localhost:27017/excel-analytics-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 3. Start Development Servers
```bash
# Start both client and server concurrently
npm run dev

# Or start individually:
npm run server  # Backend on http://localhost:5000
npm run client  # Frontend on http://localhost:5173
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 👥 User Roles & Access

### Regular User
- Register/Login to platform
- Access personal dashboard
- View analytics (Coming in Week 2-4)
- Upload Excel files (Coming in Week 2)

### Admin User
- All user permissions
- Access admin panel (`/admin`)
- Approve pending admin registrations
- View platform statistics
- Manage users and system settings

## 📡 API Endpoints

### Authentication
```
POST /api/auth/register  # Register new user
POST /api/auth/login     # User login
GET  /api/auth/me        # Get current user (protected)
```

### Admin (Admin Only)
```
GET /api/admin/pending-admins  # Get pending admin requests
PUT /api/admin/approve/:id     # Approve admin request
```

## 🎨 UI Features

### Login/Register Pages
- Modern, responsive design
- Real-time form validation
- Error/success message handling
- Auto-redirect for authenticated users

### Dashboard
- **Stats Cards**: File uploads, reports, data points, active users
- **Quick Actions**: Upload files, create reports, view analytics
- **Recent Activity**: Track user actions and platform usage
- **Progress Tracker**: Monitor development milestones

### Admin Panel
- **Pending Approvals**: Review and approve admin requests
- **System Health**: Monitor server, database, and API status
- **Platform Stats**: Overview of platform usage
- **Quick Actions**: Administrative tools and settings

## 🔮 Upcoming Features (Weeks 2-5)

### Week 2: File Upload & Parsing
- Excel file upload (.xls, .xlsx)
- Data parsing and validation
- File storage and management
- Error handling for corrupt files

### Week 3: Chart Generation
- Dynamic chart creation
- Multiple chart types (bar, line, pie, scatter)
- Chart customization options
- Export charts as images

### Week 4: Advanced Analytics
- Data filtering and sorting
- Statistical analysis
- Trend identification
- Downloadable reports

### Week 5: Deployment & Polish
- Production deployment
- Performance optimization
- Final testing and bug fixes
- Documentation completion

## 🧪 Development Commands

```bash
# Install dependencies
npm run install-all

# Development
npm run dev          # Start both client and server
npm run client       # Start frontend only
npm run server       # Start backend only
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally or update MONGO_URI in .env
   - Check MongoDB service status

2. **JWT Token Issues**
   - Clear browser localStorage
   - Check JWT_SECRET in .env file

3. **Port Conflicts**
   - Change PORT in server/.env
   - Update client API baseURL in `client/src/utils/axios.js`

4. **Dependency Issues**
   - Delete node_modules and package-lock.json
   - Run `npm run install-all` again

## 📝 Project Structure

```
excel-analytics-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utilities (API config)
├── server/                # Express backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   └── routes/           # API routes
└── README.md
```

---

**Week 1 Status**: ✅ **COMPLETED**
- Authentication system fully implemented
- Modern dashboard with responsive design
- Admin panel with user management
- All critical fixes applied
- Ready for Week 2 development