const Discord = require('discord.js');
const mongoose = require('mongoose');
const user = require('../models/user');
const userDB = require('../models/user');
module.exports = {
  aliases: ['s'],
  name: 'sell',
  category: 'Voyages',
  cooldown: '5s',
  description: 'Sell your hard-earned resources.',
  minArgs: 0,
  maxArgs: 0,
  callback: async ({ message, client, prefix, args }) => {
    const user = await userDB.findOne({ id: message.author.id });
    if (!user) return message.channel.send("I couldn't find that user in my database.");
    if (!user.inventory || user.inventory.length === 0) {
      const noResourcesEmbed = new Discord.MessageEmbed()
        .setTitle('Error')
        .setDescription("You don't have any resources to sell.")
      if (user.color) {
        noResourcesEmbed.setColor(user.color.hex);
      }

      message.lineReplyNoMention(noResourcesEmbed);
    } else {
      let sellPrice = 0;
      user.inventory.forEach( resource => {
          let multiplier = user.multipliers.sellPrice + (user.upgrades.sellPrice.currentLevel * 0.05) + (user.prestigeUpgrades.mogul * 0.4);
          sellPrice += Math.floor(resource.count * resource.value * multiplier);  
      });
      while(user.inventory.length > 0) {
        user.inventory.pop();
      }
      user.balance += sellPrice;
      const sellEmbed = new Discord.MessageEmbed()
        .setTitle('Resources Sold!')
        .setDescription(`You sold all of your resources for **$${sellPrice.toLocaleString()}**!`)
      
      if (user.color) {
        sellEmbed.setColor(user.color.hex);
      }
      await user.save();
      message.lineReplyNoMention(sellEmbed);
    }
  }
}