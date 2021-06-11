const mongoose = require('mongoose');
var boostsSchema = [new mongoose.Schema(
  {
    id: String,
    name: String,
    startTime: Number,
    endTime: Number,
    booster: String
  }
)]
const globalSchema = new mongoose.Schema({
  cooldown: Number,
  id: String,
  globalBoost: { type: boostsSchema, default: () => ({})}
})

module.exports = mongoose.model('Global', globalSchema);