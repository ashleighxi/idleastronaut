const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
  id: String,
  startDate: Number,
  endDate: Number,
  reason: String
})

module.exports = mongoose.model('Blacklist', blacklistSchema);