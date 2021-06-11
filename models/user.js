const mongoose = require('mongoose');
var boostsSchema = [new mongoose.Schema(
  {
    id: String,
    name: String,
    boost: Number,
    stat: String,
    count: Number,
    startTime: Number,
    endTime: Number
  }
)]
var colorSchema = new mongoose.Schema({
  id: { type: String, default: 'spacegrey'},
  name: { type: String, default: 'Space Grey'},
  hex: { type: String, default: '#aeacb0'}
})
var multiplierSchema = new mongoose.Schema({
  sellPrice: { type: Number, default: 1 },
  collect: { type: Number, default: 1 },
  resourceQuality: { type: Number, default: 1 },
  spacejunk: { type: Number, default: 1 },
  xp: { type: Number, default: 1 },
});
var upgradesValuesSchema = new mongoose.Schema({
  maxLevel: Number,
  currentLevel: { type: Number, default: 0 },
  baseCost: Number,
  name: String,
  description: String
});
var upgradesSchema = new mongoose.Schema({
  collect: { type: upgradesValuesSchema, default: () => ({  maxLevel: 21, name: 'Resource Collection', baseCost: 500, description: 'Receive slightly more resources.' }) },
  sellPrice: { type: upgradesValuesSchema, default: () => ({ maxLevel: 18, name: 'Marketing', baseCost: 500, description: 'Sell resources for 5% more.'}) },
  xp: { type: upgradesValuesSchema, default: () => ({ maxLevel: 5, name: 'Astronaut Training', baseCost: 50000, description: 'Increases XP gain by 10%.'}) },
  spacejunk: { type: upgradesValuesSchema, default: () => ({ maxLevel: 11, name: 'Junk Magnet', baseCost: 1000, description: 'Increases amount of space junk by 5%.' }) },
  spacejunkQuality: { type: upgradesValuesSchema, default: () => ({ maxLevel: 5, name: 'Highroller', baseCost: 50000, description: 'Improves quality of space junk found.'}) }
});
var exoticMatterSchema = new mongoose.Schema({
  purple: { type: Number, default: 0},
  red: { type: Number, default: 0 },
  green: { type: Number, default: 0 },
  yellow: { type: Number, default: 0 },
});

var prestigeUpgradesSchema = new mongoose.Schema({
  prodigalAstronaut: { type: Number, default: 0},
  mogul: { type: Number, default: 0},
  targetingSystem: { type: Number, default: 0},
  brainUpgrade: { type: Number, default: 0},
})

const userSchema = mongoose.Schema({
  id: String,
  balance: { type: Number, default: 0 },
  cooldowns: new mongoose.Schema({ 
    voyages: Number,
    daily: Number
  }),
  suits: [new mongoose.Schema({
    id: String,
    name: String,
    icon: String
  })],
  ships: [new mongoose.Schema({
    id: String,
    name: String
  })],
  badges: [new mongoose.Schema({
    id: String,
    name: String,
    count: Number
  })],
  prestige: { type: Number, default: 0 },
  level: { type: Number, default: 1},
  experience: { type: Number, default: 0},
  inventory: [new mongoose.Schema({
    id: String,
    name: String,
    value: Number,
    count: Number,
    icon: String
  })],
  planet: new mongoose.Schema({
    id: String,
    name: String,
    icon: String
  }),
  suit: new mongoose.Schema({
    id: String,
    name: String,
    icon: String
  }),
  boosts: { type: boostsSchema, default: () => ({}) },
  color: { type: colorSchema, default: () => ({}) },
  multipliers: { type: multiplierSchema, default: () => ({}) },
  upgrades: { type: upgradesSchema, default: () => ({})},
  exoticMatter: { type: exoticMatterSchema, default: () => ({})},
  prestigeUpgrades: { type: prestigeUpgradesSchema, default: () => ({}) },
  boosters: [new mongoose.Schema({
    id: String,
    name: String,
  })],
  hasVoted: Boolean
});

module.exports = mongoose.model('User', userSchema);