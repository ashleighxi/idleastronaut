const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  id: String,
  name: String,
  rarity: Number,
  value: Number,
  level: Number,
  xp: Number,
  planet: String,
  icon: String
})

module.exports = mongoose.model('Resource', resourceSchema);