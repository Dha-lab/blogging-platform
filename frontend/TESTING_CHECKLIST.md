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
