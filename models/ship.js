const mongoose = require('mongoose');

const shipSchema = new mongoose.Schema({
  id: String,
  name: String,
  cost: Number,
  boost: Number,
  cdReduction: Number,
  icon: String
})

module.exports = mongoose.model('Ship', shipSchema);