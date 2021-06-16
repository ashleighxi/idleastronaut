const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
const suitDB = require('../models/suit');
const shipDB = require('../models/ship');
module.exports = {
  aliases: [],
  name: 'shop',
  category: 'Voyages',
  cooldown: '1s',
  description: 'View the shop and upgrade your astronaut!',
  minArgs: 0,
  maxArgs: 1,
  callback: async ({ message, client, prefix, args }) => {
    let section = args[0];
    const user = await userDB.findOne({ id: message.author.id });
    if (!section) {
      const shopEmbed = new Discord.MessageEmbed()
        .setTitle(`Please provide one of the categories:\nUse ${prefix}buy <item name> to buy an item.`)
        .setDescription(`**${prefix}shop suits** - Shop for different suits.\n**${prefix}shop ships** - Buy a new ship!\n**${prefix}shop upgrades** - Purchase permanent upgrades.\n**${prefix}shop boosts** - Buy temporary boosts.`)
        
      if (user.color) {
        shopEmbed.setColor(user.color.hex);
      }  
      message.lineReplyNoMention(shopEmbed);
    } else if (section.toLowerCase() === 'suits') {
      let description = `Your balance: **$${user.balance.toLocaleString()}**\n`;
      const suits = await suitDB.find({});
      suits.forEach( suit => {
        let suitCheck = user.suits.find( ({id}) => id === suit.id);
        if (suitCheck) {
          description += `${suit.icon} **${suit.name}** - OWNED\n`;
        } else {
          description += `${suit.icon} **${suit.name}** - $${suit.cost.toLocaleString()}\n`;
        }
      })
      const shopEmbed = new Discord.MessageEmbed()
        .setTitle(`Spacesuit Shop`)
        .setDescription(description)
      
      if (user.color) {
        shopEmbed.setColor(user.color.hex);
      }  

      message.lineReplyNoMention(shopEmbed);
    } else if (section.toLowerCase() === 'ships') {
      let description = `Your balance: **$${user.balance.toLocaleString()}**\n`;
      const ships = await shipDB.find({});
      ships.forEach( ship => {
        let shipCheck = user.ships.find( ({id}) => id === ship.id);
        if (shipCheck) {
          description += `${ship.icon} **${ship.name}** - OWNED\n`;
        } else {
          description += `${ship.icon} **${ship.name}** - $${ship.cost.toLocaleString()}\n`;
        }
      })
      const shopEmbed = new Discord.MessageEmbed()
        .setTitle(`Spaceship shops - Permanent and decrease cooldown, while increasing resource collection slightly`)
        .setDescription(description)
      
      if (user.color) {
        shopEmbed.setColor(user.color.hex);
      }  
      message.lineReplyNoMention(shopEmbed);
    } else if (section.toLowerCase() === 'upgrades') {
      let description = `Your balance: **$${user.balance.toLocaleString()}**\n`;
      let upgrades = user.upgrades;
      let cost;

      cost = upgrades.collect.baseCost * Math.pow(2, upgrades.collect.currentLevel);
      cost = `$${cost.toLocaleString()}`;
      if (upgrades.collect.currentLevel === upgrades.collect.maxLevel) cost = 'MAXED';
      description += `**${upgrades.collect.currentLevel}/${upgrades.collect.maxLevel} ${upgrades.collect.name}** - ${upgrades.collect.description} - **${cost}**\n`;

      cost = upgrades.sellPrice.baseCost * Math.pow(2, upgrades.sellPrice.currentLevel);
      cost = `$${cost.toLocaleString()}`;
      if (upgrades.sellPrice.currentLevel === upgrades.sellPrice.maxLevel) cost = 'MAXED';
      description += `**${upgrades.sellPrice.currentLevel}/${upgrades.sellPrice.maxLevel} ${upgrades.sellPrice.name}** - ${upgrades.sellPrice.description} - **${cost}**\n`;

      if (upgrades.xp.currentLevel === 0) {
        cost = upgrades.xp.baseCost;
      } else {
        cost = upgrades.xp.baseCost * Math.pow(50, upgrades.xp.currentLevel);
      }
      cost = `$${cost.toLocaleString()}`;
      if (upgrades.xp.currentLevel === upgrades.xp.maxLevel) cost = 'MAXED';
      description += `**${upgrades.xp.currentLevel}/${upgrades.xp.maxLevel} ${upgrades.xp.name}** - ${upgrades.xp.description} - **${cost}**\n`;

      cost = upgrades.spacejunk.baseCost * Math.pow(5, upgrades.spacejunk.currentLevel);
      cost = `$${cost.toLocaleString()}`;
      if (upgrades.spacejunk.currentLevel === upgrades.spacejunk.maxLevel) cost = 'MAXED';
      description += `**${upgrades.spacejunk.currentLevel}/${upgrades.spacejunk.maxLevel} ${upgrades.spacejunk.name}** - ${upgrades.spacejunk.description} - **${cost}**\n`;

      cost = upgrades.spacejunkQuality.baseCost * Math.pow(5, upgrades.spacejunkQuality.currentLevel);
      cost = `$${cost.toLocaleString()}`;
      if (upgrades.spacejunkQuality.currentLevel === upgrades.spacejunkQuality.maxLevel) cost = 'MAXED';
      description += `**${upgrades.spacejunkQuality.currentLevel}/${upgrades.spacejunkQuality.maxLevel} ${upgrades.spacejunkQuality.name}** - ${upgrades.spacejunkQuality.description} - **${cost}**\n`;
      
      const shopEmbed = new Discord.MessageEmbed()
        .setTitle(`All upgrades are PERMANENT and can be leveled up.\nUse ${prefix}buy <upgrade name> to level up your upgrades.`)
        .setDescription(description)
      
      if (user.color) {
        shopEmbed.setColor(user.color.hex);
      }  
      message.lineReplyNoMention(shopEmbed);
    } else if (section.toLowerCase() === 'boosts') {
      let description = `You currently have: ${user.exoticMatter.yellow} <a:yellowexoticmatter:844649686673653771>, and ${user.exoticMatter.green} <a:greenexoticmatter:844649631098339350>.\n`;
      description += `12 <a:yellowexoticmatter:844649686673653771> - Increase resource collection for 5 minutes. **${prefix}buy Collect5m**\n`;
      description += `12 <a:yellowexoticmatter:844649686673653771> - Increase space junk collection for 5 minutes. **${prefix}buy Junk5m**\n`;
      description += `12 <a:greenexoticmatter:844649631098339350> - Increase resource collection for 20 minutes. **${prefix}buy Collect20m**\n`;
      description += `12 <a:greenexoticmatter:844649631098339350> - Increase space junk collection for 20 minutes. **${prefix}buy Junk20m**\n`;
      const shopEmbed = new Discord.MessageEmbed()
        .setTitle(`Temporary Boosts`)
        .setDescription(description)
      
      if (user.color) {
        shopEmbed.setColor(user.color.hex);
      }  
      message.lineReplyNoMention(shopEmbed);
    }
  }
}