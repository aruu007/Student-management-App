const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  cgpa: { type: String, required: true }
});

module.exports = mongoose.model('Student', studentSchema);
