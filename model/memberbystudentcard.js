const mongoose = require('mongoose');

const memberByStudentCardSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    studentcard: { type: String, required: true, unique: true },
    faculty: { type: String, required: true },
});

const memberByStudentCard = mongoose.model('memberByStudentCard', memberByStudentCardSchema);

module.exports = memberByStudentCard;