const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// POST /students -> add new student
router.post('/', async (req, res) => {
  try {
    const { id, name, cgpa } = req.body;
    if (id === undefined || !name || !cgpa) return res.status(400).json({ message: 'id, name, cgpa required' });
    const exists = await Student.findOne({ id });
    if (exists) return res.status(400).json({ message: 'Student with this id already exists' });
    const student = new Student({ id, name, cgpa });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /students -> view all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ id: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /students/:id -> view one student by id (number)
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /students/:id -> update student
router.put('/:id', async (req, res) => {
  try {
    const { name, cgpa } = req.body;
    const student = await Student.findOneAndUpdate({ id: req.params.id }, { name, cgpa }, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /students/:id -> delete student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ id: req.params.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
