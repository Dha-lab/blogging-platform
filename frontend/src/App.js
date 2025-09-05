import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import GuestView from "./components/GuestView";
import Navbar from "./components/Navbar";
import PostsList from "./components/PostsList";
import CreatePost from "./components/CreatePost";
import EditPost from "./components/EditPost";
import AdminPanel from "./components/AdminPanel";

const API_BASE = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Auth form states
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  // Create post form
  const [postData, setPostData] = useState({ title: "", content: "" });
  const [postLoading, setPostLoading] = useState(false);

  // Edit post states
  const [editingPost, setEditingPost] = useState(null);
  const [editData, setEditData] = useState({ title: "", content: "" });
  const [editLoading, setEditLoading] = useState(false);

  const fetchPosts = React.useCallback(async () => {
    try {
      const [allPosts, userPosts] = await Promise.all([
        api.get("/posts"),
        user ? api.get("/posts/my") : Promise.resolve({ data: [] }),
      ]);
      setPosts(allPosts.data);
      setMyPosts(userPosts.data);
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
        fetchPosts();
        if (user.role === "admin") {
          fetchAdminData();
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, [fetchPosts]);

  async function fetchAdminData() {
    try {
      const [userRes, statsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/stats"),
      ]);
      setUsers(userRes.data);
      setStats(statsRes.data);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", loginData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setCurrentView("posts");
      fetchPosts();
      if (res.data.user.role === "admin") fetchAdminData();
    } catch (e) {
      setError(e.response?.data?.msg || "Login failed");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/register", registerData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setCurrentView("posts");
      fetchPosts();
      if (res.data.user.role === "admin") fetchAdminData();
    } catch (e) {
      setError(e.response?.data?.msg || "Registration failed");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleCreatePost(e, status = "published") {
    e.preventDefault();
    setPostLoading(true);
    setError("");
    try {
      await api.post("/posts", { ...postData, status });
      setPostData({ title: "", content: "" });
      setCurrentView("posts");
      fetchPosts();
      alert(status === "published" ? "Post published!" : "Draft saved!");
    } catch (e) {
      setError(e.response?.data?.msg || "Could not create post");
    }
    setPostLoading(false);
  }

  function openEditPost(post) {
    setEditingPost(post);
    setEditData({ title: post.title, content: post.content });
    setCurrentView("editPost");
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  }

  async function handleUpdatePost(e) {
    e.preventDefault();
    setEditLoading(true);
    try {
      await api.put(`/posts/${editingPost._id}`, editData);
      alert('Post updated successfully!');
      setEditingPost(null);
      setCurrentView('posts');
      fetchPosts();
    } catch (error) {
      alert('Error updating post.');
      console.error(error);
    }
    setEditLoading(false);
  }

  async function handleDeletePost(id) {
    if (!window.confirm("Confirm delete?")) return;
    try {
      await api.delete(`/posts/${id}`);
      fetchPosts();
    } catch {
      alert("Failed to delete post");
    }
  }

  async function handleUserRoleChange(id, role) {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      fetchAdminData();
    } catch {
      alert("Failed to update role");
    }
  }

  async function handleDeleteUser(id) {
    if (!window.confirm("Confirm user deletion?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchAdminData();
      fetchPosts();
    } catch {
      alert("Failed to delete user");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCurrentView("posts");
    setPosts([]);
    setMyPosts([]);
    setUsers([]);
    setStats({});
  }

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );

  if (!user)
    return (
      <GuestView
        loginData={loginData}
        registerData={registerData}
        setLoginData={setLoginData}
        setRegisterData={setRegisterData}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        formLoading={formLoading}
        error={error}
      />
    );

  return (
    <div className="app">
      <Navbar
        user={user}
        currentView={currentView}
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
      />
      <div className="main-content">
        {currentView === "posts" && (
          <PostsList
            posts={posts}
            user={user}
            openEditPost={openEditPost}
            handleDeletePost={handleDeletePost}
          />
        )}
        {currentView === "my-posts" && (
          <PostsList
            posts={myPosts}
            user={user}
            openEditPost={openEditPost}
            handleDeletePost={handleDeletePost}
          />
        )}
        {currentView === "create" && (
          <CreatePost
            postData={postData}
            setPostData={setPostData}
            handleCreatePost={handleCreatePost}
            postLoading={postLoading}
            user={user}
            setCurrentView={setCurrentView}
            error={error}
          />
        )}
        {currentView === "editPost" && editingPost && (
          <EditPost
            editData={editData}
            handleEditChange={handleEditChange}
            handleUpdatePost={handleUpdatePost}
            handleCancel={() => {
              setEditingPost(null);
              setCurrentView("posts");
            }}
            editLoading={editLoading}
          />
        )}
        {currentView === "admin" && user.role === "admin" && (
          <AdminPanel
            users={users}
            stats={stats}
            handleUserRoleChange={handleUserRoleChange}
            handleDeleteUser={handleDeleteUser}
          />
        )}
      </div>
    </div>
  );
}

export default App;
