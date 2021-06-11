const mongoose = require('mongoose');

const spaceJunkSchema = new mongoose.Schema({
  rarity: String,
  reward: String,
  icon: String
})

module.exports = mongoose.model('Space Junk', spaceJunkSchema);