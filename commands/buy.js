const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
const suitDB = require('../models/suit');
const shipDB = require('../models/ship');
const resourceDB = require('../models/resource');
module.exports = {
  aliases: [],
  name: 'buy',
  category: 'Voyages',
  cooldown: '1s',
  description: 'Purchase items from the shop',
  minArgs: 1,
  callback: async ({ message, client, prefix, args }) => {
    let choice = args.join(' ');
    const user = await userDB.findOne({ id: message.author.id });
    const suits = await suitDB.find({});
    const ships = await shipDB.find({});
    const upgrades = user.upgrades;
    const collect = upgrades.collect;
    const sellPrice = upgrades.sellPrice;
    const xp = upgrades.xp;
    const spacejunk = upgrades.spacejunk;
    const spacejunkQuality = upgrades.spacejunkQuality;
    let suitCheck = suits.find( ({id, name}) => id === choice.toLowerCase() || name.toLowerCase() === choice.toLowerCase());
    let shipCheck = ships.find( ({id, name}) => id === choice.toLowerCase() || name.toLowerCase() === choice.toLowerCase());
    if (suitCheck) {
      let userCheck = user.suits.find( ({id}) => id === suitCheck.id);
      if (userCheck) {
        const errorEmbed = new Discord.MessageEmbed()
        .setDescription('❌ You already own this Spacesuit.')
        if (user.color) {
          errorEmbed.setColor(user.color.hex);
        }  
        return message.lineReplyNoMention(errorEmbed);
      } else {
        if (user.balance >= suitCheck.cost) {
          await user.suits.push({
            id: suitCheck.id,
            name: suitCheck.name,
            icon: suitCheck.icon
          });
          user.suit = {
            id: suitCheck.id,
            name: suitCheck.name,
            icon: suitCheck.icon
          }
          user.balance -= suitCheck.cost;
          const successEmbed = new Discord.MessageEmbed()
            .setDescription(`✅ You've successfully purchased the ${suitCheck.icon} **${suitCheck.name}**!`)
            .setColor("RANDOM")
          if (user.color) {
            successEmbed.setColor(user.color.hex);
          }  
          await user.save();
          message.lineReplyNoMention(successEmbed);
        } else {
          const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You can\'t afford this Spacesuit.')
          
          if (user.color) {
            errorEmbed.setColor(user.color.hex);
          }  
          return message.lineReplyNoMention(errorEmbed);
        }
      }
    } else if (shipCheck) {
      let userCheck = user.ships.find( ({id}) => id === shipCheck.id);
      if (userCheck) {
        const errorEmbed = new Discord.MessageEmbed()
        .setDescription('❌ You already own this Spaceship.')
        if (user.color) {
          errorEmbed.setColor(user.color.hex);
        }  
        return message.lineReplyNoMention(errorEmbed);
      } else {
        if (user.balance >= shipCheck.cost) {
          await user.ships.push({
            id: shipCheck.id,
            name: shipCheck.name,
            icon: shipCheck.icon
          });
          user.balance -= shipCheck.cost;
          const successEmbed = new Discord.MessageEmbed()
            .setDescription(`✅ You've successfully purchased the ${shipCheck.icon} **${shipCheck.name}**!`)
          if (user.color) {
            successEmbed.setColor(user.color.hex);
          }  

          await user.save();
          message.lineReplyNoMention(successEmbed);
        } else {
          const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You can\'t afford this Spaceship.')
          if (user.color) {
            errorEmbed.setColor(user.color.hex);
          }  
          return message.lineReplyNoMention(errorEmbed);
        }
      }
    } else if (choice.toLowerCase() === collect.name.toLowerCase()) {
      let item = collect;
      if (user.balance >= item.baseCost * (Math.pow(2, item.currentLevel))) {
        if (item.currentLevel < item.maxLevel) {
          
          user.balance -= item.baseCost * (Math.pow(2, item.currentLevel));
          item.currentLevel++;
          const successEmbed = new Discord.MessageEmbed()
            .setDescription(`✅ You just bought **${item.name}** level ${item.currentLevel}!`)
          if (user.color) {
            successEmbed.setColor(user.color.hex);
          }  
          await user.save();
          message.lineReplyNoMention(successEmbed);
        } else {
          const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You\'ve already maxed this upgrade.')
          if (user.color) {
            errorEmbed.setColor(user.color.hex);
          }  
          return message.lineReplyNoMention(errorEmbed);
        }
      } else {
        const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You can\'t afford this upgrade.')
          if (user.color) {
            errorEmbed.setColor(user.color.hex);
          }  
          return message.lineReplyNoMention(errorEmbed);
      }
    } else if (choice.toLowerCase() === sellPrice.name.toLowerCase()) {
      let item = sellPrice;
      if (user.balance >= item.baseCost * (Math.pow(2, item.currentLevel))) {
        if (item.currentLevel < item.maxLevel) {
          
          user.balance -= item.baseCost * (Math.pow(2, item.currentLevel));
          item.currentLevel++;
          const successEmbed = new Discord.MessageEmbed()
            .setDescription(`✅ You just bought **${item.name}** level ${item.currentLevel}!`)
          if (user.color) {
            successEmbed.setColor(user.color.hex);
          }  
          await user.save();
          message.lineReplyNoMention(successEmbed);
        } else {
          const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You\'ve already maxed this upgrade.')
          if (user.color) {
            errorEmbed.setColor(user.color.hex);
          }  
          return message.lineReplyNoMention(errorEmbed);
        }
      } else {
        const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You can\'t afford this upgrade.')
          if (user.color) {
            errorEmbed.setColor(user.color.hex);
          }  
          return message.lineReplyNoMention(errorEmbed);
      }
    } else if (choice.toLowerCase() === xp.name.toLowerCase()) {
      let item = xp;
      let cost = 0;
      if (user.balance >= (item.baseCost * (Math.pow(50, item.currentLevel)))) {
        if (item.currentLevel < item.maxLevel) {
          if (item.currentLevel === 0) {
            cost = item.baseCost;
          } else {
            cost = item.baseCost * (Math.pow(50, item.currentLevel));
          }
          item.currentLevel++;
          user.balance -= cost;
          const successEmbed = new Discord.MessageEmbed()
            .setDescription(`✅ You just bought **${item.name}** level ${item.currentLevel}!`)
          if (user.color) {
            successEmbed.setColor(user.color.hex);
          }  
          await user.save();
          message.lineReplyNoMention(successEmbed);
        } else {
          const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You\'ve already maxed this upgrade.')
          if (user.color) {
            errorEmbed.setColor(user.color.hex);
          }  
          return message.lineReplyNoMention(errorEmbed);
        }
      } else {
        const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You can\'t afford this upgrade.')
          if (user.color) {
            errorEmbed.setColor(user.color.hex);
          }  
          return message.lineReplyNoMention(errorEmbed);
      }
    } else if (choice.toLowerCase() === spacejunk.name.toLowerCase()) {
      let item = spacejunk;
      if (user.balance >= item.baseCost * (Math.pow(5, item.currentLevel))) {
        if (item.currentLevel < item.maxLevel) {
          
          user.balance -= item.baseCost * (Math.pow(5, item.currentLevel));
          item.currentLevel++;
          const successEmbed = new Discord.MessageEmbed()
            .setDescription(`✅ You just bought **${item.name}** level ${item.currentLevel}!`)
          if (user.color) {
            successEmbed.setColor(user.color.hex);
          }  
          await user.save();
          message.lineReplyNoMention(successEmbed);
        } else {
          const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You\'ve already maxed this upgrade.')
          if (user.color) {
            errorEmbed.setColor(user.color.hex);
          }  
          return message.lineReplyNoMention(errorEmbed);
        }
      } else {
        const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You can\'t afford this upgrade.')
          if (user.color) {
            errorEmbed.setColor(user.color.hex);
          }  
          return message.lineReplyNoMention(errorEmbed);
      }
    } else if (choice.toLowerCase() === spacejunkQuality.name.toLowerCase()) {
      let item = spacejunkQuality;
      if (user.balance >= item.baseCost * (Math.pow(5, item.currentLevel))) {
        if (item.currentLevel < item.maxLevel) {
          
          user.balance -= item.baseCost * (Math.pow(5, item.currentLevel));
          item.currentLevel++;
          const successEmbed = new Discord.MessageEmbed()
            .setDescription(`✅ You just bought **${item.name}** level ${item.currentLevel}!`)
          if (user.color) {
            successEmbed.setColor(user.color.hex);
          }  
          await user.save();
          message.lineReplyNoMention(successEmbed);
        } else {
          const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You\'ve already maxed this upgrade.')
          if (user.color) {
            errorEmbed.setColor(user.color.hex);
          }  
          return message.lineReplyNoMention(errorEmbed);
        }
      } else {
        const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You can\'t afford this upgrade.')
          if (user.color) {
            errorEmbed.setColor(user.color.hex);
          }  
          return message.lineReplyNoMention(errorEmbed);
      }
    } else if (choice.toLowerCase() === 'collect5m' || choice.toLowerCase() === 'collect 5m') {
      let currentBoost = user.boosts.find( ({id}) => id === 'collect5m' || id === 'collect20m');
      if (currentBoost) {
        const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You already have this boost active.')
        if (user.color) {
          errorEmbed.setColor(user.color.hex);
        }  
        return message.lineReplyNoMention(errorEmbed);
      }
      if (user.exoticMatter.yellow >= 12) {
        let boost = {
          id: 'collect5m',
          name: 'Collect 5m',
          boost: 0.5,
          stat: 'collect',
          count: 1,
          startTime: Date.now(),
          endTime: Date.now() + (1000 * 60 * 5)
        };
        user.boosts.push(boost);
        user.exoticMatter.yellow -= 12;
        await user.save();
        const successEmbed = new Discord.MessageEmbed()
            .setDescription(`✅ You will now collect more resources for 5 minutes!`)
        if (user.color) {
          successEmbed.setColor(user.color.hex);
        }  
        await message.lineReplyNoMention(successEmbed);
      } else {
        const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You can\'t afford this boost.')
        if (user.color) {
          errorEmbed.setColor(user.color.hex);
        }  
        return message.lineReplyNoMention(errorEmbed);
      }
    } else if (choice.toLowerCase() === 'collect20m' || choice.toLowerCase() === 'collect 20m') {
      let currentBoost = user.boosts.find( ({id}) => id === 'collect5m' || id === 'collect20m');
      if (currentBoost) {
        const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You already have this boost active.')
        if (user.color) {
          errorEmbed.setColor(user.color.hex);
        }  
        return message.lineReplyNoMention(errorEmbed);
      }
      if (user.exoticMatter.green >= 12) {
        let boost = {
          id: 'collect20m',
          name: 'Collect 20m',
          boost: 0.5,
          stat: 'collect',
          count: 1,
          startTime: Date.now(),
          endTime: Date.now() + (1000 * 60 * 20)
        };
        user.boosts.push(boost);
        user.exoticMatter.green -= 12;
        await user.save();
        const successEmbed = new Discord.MessageEmbed()
            .setDescription(`✅ You will now collect more resources for 20 minutes!`)
        if (user.color) {
          successEmbed.setColor(user.color.hex);
        }  
        await message.lineReplyNoMention(successEmbed);
      } else {
        const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You can\'t afford this boost.')
        if (user.color) {
          errorEmbed.setColor(user.color.hex);
        }  
        return message.lineReplyNoMention(errorEmbed);
      }
    } else if (choice.toLowerCase() === 'junk5m' || choice.toLowerCase() === 'junk 5m') {
      let currentBoost = user.boosts.find( ({id}) => id === 'junk5m' || id === 'junk20m');
      if (currentBoost) {
        const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You already have this boost active.')
        if (user.color) {
          errorEmbed.setColor(user.color.hex);
        }  
        return message.lineReplyNoMention(errorEmbed);
      }
      if (user.exoticMatter.yellow >= 12) {
        let boost = {
          id: 'junk5m',
          name: 'Junk 5m',
          boost: 0.5,
          stat: 'junk',
          count: 1,
          startTime: Date.now(),
          endTime: Date.now() + (1000 * 60 * 5)
        };
        user.boosts.push(boost);
        user.exoticMatter.yellow -= 12;
        await user.save();
        const successEmbed = new Discord.MessageEmbed()
            .setDescription(`✅ You will now collect more space junk for 5 minutes!`)
        if (user.color) {
          successEmbed.setColor(user.color.hex);
        }  
        await message.lineReplyNoMention(successEmbed);
      } else {
        const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You can\'t afford this boost.')
        if (user.color) {
          errorEmbed.setColor(user.color.hex);
        }  
        return message.lineReplyNoMention(errorEmbed);
      }
    } else if (choice.toLowerCase() === 'junk20m' || choice.toLowerCase() === 'junk 20m') {
      let currentBoost = user.boosts.find( ({id}) => id === 'junk5m' || id === 'junk20m');
      if (currentBoost) {
        const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You already have this boost active.')
        if (user.color) {
          errorEmbed.setColor(user.color.hex);
        }  
        return message.lineReplyNoMention(errorEmbed);
      }
      if (user.exoticMatter.green >= 12) {
        let boost = {
          id: 'junk20m',
          name: 'Junk 20m',
          boost: 0.5,
          stat: 'junk',
          count: 1,
          startTime: Date.now(),
          endTime: Date.now() + (1000 * 60 * 20)
        };
        user.boosts.push(boost);
        user.exoticMatter.green -= 12;
        await user.save();
        const successEmbed = new Discord.MessageEmbed()
            .setDescription(`✅ You will now collect more space junk for 20 minutes!`)
        if (user.color) {
          successEmbed.setColor(user.color.hex);
        }  
        await message.lineReplyNoMention(successEmbed);
      } else {
        const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You can\'t afford this boost.')
        if (user.color) {
          errorEmbed.setColor(user.color.hex);
        }  
        return message.lineReplyNoMention(errorEmbed);
      }
    } else if (choice.toLowerCase() === 'auto10m' || choice.toLowerCase() === 'auto 10m') {
      let currentBoost = user.boosts.find( ({id}) => id === 'auto10m' || id === 'auto30m');
      if (currentBoost) {
        const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You already have an alien worker active.')
        if (user.color) {
          errorEmbed.setColor(user.color.hex);
        }  
        return message.lineReplyNoMention(errorEmbed);
      }
      if (user.exoticMatter.yellow >= 16) {
        let boost = {
          id: 'auto10m',
          name: 'Worker',
          boost: 1,
          stat: 'worker',
          count: 1,
          startTime: Date.now(),
          endTime: Date.now() + (1000 * 60 * 10)
        };
        user.boosts.push(boost);
        user.exoticMatter.yellow -= 16;
        await user.save();
        const successEmbed = new Discord.MessageEmbed()
            .setDescription(`✅ You've hired an alien worker to collect resources for **10 minutes**!`)
        if (user.color) {
          successEmbed.setColor(user.color.hex);
        }  
        await message.lineReplyNoMention(successEmbed);
        let newWorker = setInterval(worker(), 60*1000);
      } else {
        const errorEmbed = new Discord.MessageEmbed()
            .setDescription('❌ You can\'t afford this boost.')
        if (user.color) {
          errorEmbed.setColor(user.color.hex);
        }  
        return message.lineReplyNoMention(errorEmbed);
      }
    }
  }

}

const worker = (user) => {
  const userPlanet = user.planet.id;
  const resources = await resourceDB.find({ planet: userPlanet });
  const suit = await suitDB.findOne({ id: userSuit.id });
  let result = [];
  let potentialResources = [];
  let options = [];
  let amounts = []
  resources.forEach( resource => {
    for (let i = 0; i < resource.rarity; i++) {
      if (user.level >= resource.level) {
        potentialResources.push(resource);
      }
    }
    options.push(resource);
    amounts.push(0);
  });
  for (let i = 0; i < rolls; i++) {
    let roll = Math.floor(Math.random() * (potentialResources.length + 1)) + suit.boost + totalShipBoost;
    if (roll > potentialResources.length) roll = potentialResources.length - 1;
    result[i] = potentialResources[roll];
    
    for (let x = 0; x < options.length; x++) {
      if (result[i] === options[x]) {
        amounts[x] += 1;
        xpGained += options[x].xp;
      }
    } 
  }

  for (let i = 0; i < options.length; i++) {
    if (amounts[i] > 0) {
      let resourceCheck = user.inventory.find( ({id}) => id === options[i].id);
      if (resourceCheck) {
        resourceCheck.count += amounts[i];
      } else {
        user.inventory.push({
          id: options[i].id,
          name: options[i].name,
          value: options[i].value, 
          count: amounts[i],
          icon: options[i].icon
        });
      }
      collected += `${amounts[i]} ${options[i].icon} ${options[i].name}\n`;
    }
  }

}