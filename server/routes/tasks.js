const express = require('express');
const { Task } = require('../models');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

/**
 * GET /api/tasks?filter=all|completed|pending
 * returns tasks for the authenticated user
 */
router.get('/', async (req, res) => {
  const filter = req.query.filter || 'all';
  const where = { userId: req.user.id };
  if (filter === 'completed') where.completed = true;
  if (filter === 'pending') where.completed = false;
  try {
    const tasks = await Task.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

/**
 * POST /api/tasks
 * body: { title, description }
 */
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'Title required' });
  try {
    const t = await Task.create({ title, description, userId: req.user.id });
    res.json(t);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create task' });
  }
});

/**
 * PUT /api/tasks/:id
 * body: { title?, description?, completed? }
 */
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findOne({ where: { id, userId: req.user.id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const { title, description, completed } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update task' });
  }
});

/**
 * DELETE /api/tasks/:id
 */
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const count = await Task.destroy({ where: { id, userId: req.user.id } });
    if (!count) return res.status(404).json({ message: 'Task not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

module.exports = router;
