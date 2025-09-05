const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const router = express.Router();

// Create Post (protected)
router.post('/', auth, async (req, res) => {
  try {
    const post = new Post({ ...req.body, author: req.user.userId });
    await post.save();
    const populatedPost = await Post.findById(post._id).populate('author', 'name');
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all posts
router.get('/', async (_, res) => {
  const posts = await Post.find().populate('author', 'name');
  res.json(posts);
});

// Get user's posts (protected)
router.get('/my', auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.userId }).populate('author', 'name');
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get post by ID
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name');
  if (!post) return res.status(404).json({ msg: 'Post not found' });
  res.json(post);
});

// Update post (author or admin only)
router.put('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ msg: 'Post not found' });
  if (post.author.toString() !== req.user.userId && req.user.role !== 'admin')
    return res.status(403).json({ msg: 'Not authorized' });
  Object.assign(post, req.body);
  await post.save();
  res.json(post);
});

// Delete post (author or admin only)
router.delete('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ msg: 'Post not found' });
  if (post.author.toString() !== req.user.userId && req.user.role !== 'admin')
    return res.status(403).json({ msg: 'Not authorized' });
  await Post.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Post removed' });
});

module.exports = router;
