const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  id: String,
  name: String,
  hex: String,
  level: Number,
  prestige: Number
})

module.exports = mongoose.model('Color', colorSchema);