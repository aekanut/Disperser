const mongoose = require('mongoose');

const memberByIdCardSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    idcard: { type: String, required: true, unique: true },
    dateofbirth: { type: String, required: true }
});

const memberByIDCard = mongoose.model('memberByIDCard',  memberByIdCardSchema);

module.exports = memberByIDCard;