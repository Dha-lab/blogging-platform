# Blogging Platform

A full-stack blogging platform built with React, Node.js, Express, and MongoDB.

## Features

- 🔐 **User Authentication** - Register, login with JWT tokens
- 📝 **Blog Management** - Create, read, update, delete blog posts
- 👨‍💼 **Admin Panel** - User management and content moderation
- 📱 **Responsive Design** - Mobile-first responsive UI
- 🎨 **Modern UI** - Clean and intuitive user interface
- 🔒 **Role-based Access** - User and admin roles with different permissions

## Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Axios for API calls
- CSS3 with modern styling

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**

2. **Setup Backend**

Create `.env` file:

Start backend:

3. **Setup Frontend**

4. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Posts
- `GET /api/posts` - Get all published posts
- `GET /api/posts/my` - Get user's posts (protected)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/posts` - Get all posts (admin only)
- `GET /api/admin/stats` - Get dashboard stats (admin only)
- `PUT /api/admin/users/:id/role` - Update user role (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

## Default Credentials

For testing purposes, create an admin user:
1. Register a new user
2. Manually update the role to 'admin' in MongoDB
3. Or use the admin panel to promote users

## Deployment

### Backend (Render/Railway/Heroku)
1. Create account on chosen platform
2. Connect your GitHub repository
3. Set environment variables:
- `MONGO_URI`
- `JWT_SECRET`
- `NODE_ENV=production`
4. Deploy

### Frontend (Netlify/Vercel)
1. Build the project: `npm run build`
2. Upload `build` folder to chosen platform
3. Update API URL in environment variables

## Project Structure
blogging-platform/
├── backend/
│ ├── models/ # Database models
│ ├── routes/ # API routes
│ ├── middleware/ # Custom middleware
│ ├── server.js # Main server file
│ └── .env # Environment variables
├── frontend/
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── services/ # API services
│ │ └── App.js # Main App component
│ └── public/
└── README.md

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Create Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email your-email@example.com or create an issue on GitHub.
# Testing Checklist

## Day 7 - Final Testing

### ✅ Authentication Testing
- [ ] User registration works
- [ ] User login works
- [ ] JWT token is stored correctly
- [ ] Protected routes require authentication
- [ ] Logout clears token and redirects

### ✅ Blog Post CRUD Testing
- [ ] Create new post (published)
- [ ] Create new post (draft)
- [ ] View all posts list
- [ ] View single post details
- [ ] Edit own posts
- [ ] Delete own posts
- [ ] Non-owners cannot edit/delete others' posts

### ✅ Admin Panel Testing
- [ ] Only admins can access admin panel
- [ ] View all users list
- [ ] Promote user to admin
- [ ] Demote admin to user
- [ ] Delete user (and their posts)
- [ ] View all posts (including drafts)
- [ ] Delete any post as admin
- [ ] View dashboard statistics

### ✅ UI/UX Testing
- [ ] Navbar navigation works
- [ ] Mobile menu functions properly
- [ ] Loading states display correctly
- [ ] Error messages show appropriately
- [ ] Forms validate input properly
- [ ] Responsive design works on mobile
- [ ] User feedback for actions (success/error)

### ✅ Error Handling Testing
- [ ] Invalid login credentials
- [ ] Network errors are handled
- [ ] Missing form fields show validation
- [ ] Unauthorized actions show proper errors
- [ ] 404 errors for non-existent posts/users

### ✅ Performance Testing
- [ ] Page load times are acceptable
- [ ] API responses are quick
- [ ] No memory leaks in React components
- [ ] Large content handles properly

### ✅ Security Testing
- [ ] Passwords are hashed in database
- [ ] JWT tokens expire properly
- [ ] Admin routes require admin role
- [ ] SQL injection protection (using Mongoose)
- [ ] CORS configured properly

### ✅ Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### ✅ Deployment Testing
- [ ] Backend deploys successfully
- [ ] Frontend builds without errors
- [ ] Environment variables are set
- [ ] Database connection works in production
- [ ] API endpoints accessible from frontend

## Bug Report Template

When bugs are found, document them as:

**Bug Title:** Brief description
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:** What should happen
**Actual Result:** What actually happens
**Browser/Device:** Where the bug occurs
**Priority:** High/Medium/Low

