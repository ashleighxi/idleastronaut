const mongoose = require('mongoose');

const suitSchema = new mongoose.Schema({
  id: String,
  name: String,
  cost: Number,
  boost: Number,
  icon: String
})

module.exports = mongoose.model('Suit', suitSchema);