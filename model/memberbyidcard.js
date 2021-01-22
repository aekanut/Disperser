const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");

const memberByIdCardSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    idcard: { type: String, required: true, unique: true },
    dateofbirth: { type: String, required: true },
    Date: { type: String, required: true }
});

autoIncrement.initialize(mongoose.connection);
memberByIdCardSchema.plugin(autoIncrement.plugin, {
  model: "memberByIDCard", // collection or table name in which you want to apply auto increment
  field: "_id", // field of model which you want to auto increment
  startAt: 1, // start your auto increment value from 1
  incrementBy: 1, // incremented by 1
});

const memberByIDCard = mongoose.model('memberByIDCard',  memberByIdCardSchema);

module.exports = memberByIDCard;