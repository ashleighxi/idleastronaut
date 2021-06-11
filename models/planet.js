const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
  id: String,
  name: String,
  level: Number,
  resources: [String],
  icon: String,
  baseCooldown: Number
})

module.exports = mongoose.model('Planet', planetSchema);