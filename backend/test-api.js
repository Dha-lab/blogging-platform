const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123'
};

let userToken = '';
let adminToken = '';
let testPostId = '';

async function runTests() {
  console.log('🧪 Starting API Tests...\n');
  
  try {
    // Test 1: Register regular user
    console.log('1. Testing user registration...');
    const registerRes = await axios.post(`${API_BASE}/auth/register`, testUser);
    userToken = registerRes.data.token;
    console.log('✅ User registration successful\n');
    
    // Test 2: Register admin user
    console.log('2. Testing admin registration...');
    const adminRegisterRes = await axios.post(`${API_BASE}/auth/register`, adminUser);
    adminToken = adminRegisterRes.data.token;
    
    // Manually update admin role in database for testing
    console.log('📝 Note: Manually update admin user role in database\n');
    
    // Test 3: User login
    console.log('3. Testing user login...');
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    userToken = loginRes.data.token;
    console.log('✅ User login successful\n');
    
    // Test 4: Create blog post
    console.log('4. Testing post creation...');
    const postData = {
      title: 'Test Blog Post',
      content: 'This is a test blog post content. It should be long enough to test the preview functionality.'
    };
    
    const createPostRes = await axios.post(`${API_BASE}/posts`, postData, {
      headers: { 'x-auth-token': userToken }
    });
    testPostId = createPostRes.data._id;
    console.log('✅ Post creation successful\n');
    
    // Test 5: Get all posts
    console.log('5. Testing get all posts...');
    const getAllPostsRes = await axios.get(`${API_BASE}/posts`);
    console.log(`✅ Retrieved ${getAllPostsRes.data.length} posts\n`);
    
    // Test 6: Get single post
    console.log('6. Testing get single post...');
    const getSinglePostRes = await axios.get(`${API_BASE}/posts/${testPostId}`);
    console.log('✅ Single post retrieval successful\n');
    
    // Test 7: Update post
    console.log('7. Testing post update...');
    const updateData = {
      title: 'Updated Test Blog Post',
      content: 'This is the updated content for the test blog post.'
    };
    
    const updatePostRes = await axios.put(`${API_BASE}/posts/${testPostId}`, updateData, {
      headers: { 'x-auth-token': userToken }
    });
    console.log('✅ Post update successful\n');
    
    // Test 8: Get user's posts
    console.log('8. Testing get user posts...');
    const getUserPostsRes = await axios.get(`${API_BASE}/posts/my`, {
      headers: { 'x-auth-token': userToken }
    });
    console.log(`✅ Retrieved ${getUserPostsRes.data.length} user posts\n`);
    
    // Test 9: Delete post
    console.log('9. Testing post deletion...');
    const deletePostRes = await axios.delete(`${API_BASE}/posts/${testPostId}`, {
      headers: { 'x-auth-token': userToken }
    });
    console.log('✅ Post deletion successful\n');
    
    console.log('🎉 All tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.msg || error.message);
  }
}

// Run tests
runTests();
