const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
module.exports = {
  aliases: [],
  name: 'prestige',
  category: 'Voyages',
  cooldown: '1s',
  description: 'View the prestige requirements, purchase things from the prestige shop, and upgrade your astronaut!',
  minArgs: 0,
  maxArgs: 3,
  callback: async ({ message, client, prefix, args }) => {
    let section = args[0];
    const user = await userDB.findOne({ id: message.author.id });
    let prestige = user.prestige;
    let levelReq = 1000 + (100 * prestige);
    let baseCost = 10000000000;
    let balanceReq = Math.floor(baseCost * (Math.pow(1.5, prestige)));
    if (!section) {
      const shopEmbed = new Discord.MessageEmbed()
        .setTitle(`Prestige info\nReset your progress for powerful, permanent perks.`)
        .setDescription(`Current Prestige: ${prestige}\nRequirements: level **${levelReq.toLocaleString()}** and **$${balanceReq.toLocaleString()}**\n**${prefix}prestige reset** - Reset your progress for one Purple Exotic Matter <a:purpleexoticmatter:844649568557334558>!\n**${prefix}prestige shop** - Check out the perks you can buy with Purple Exotic Matter.\n**${prefix}prestige buy** - Buy a prestige perk with your Purple Exotic Matter.`)
        
      if (user.color) {
        shopEmbed.setColor(user.color.hex);
      }  
      message.lineReplyNoMention(shopEmbed);
    } else if (section.toLowerCase() === 'reset') {
      const prestigeEmbed = new Discord.MessageEmbed()
        
        
      if (user.level >= levelReq && user.balance >= balanceReq) {
        user.prestige += 1;
        user.level = 1;
        user.experience = 0;
        user.balance = 0;
        user.exoticMatter.yellow = 0;
        user.exoticMatter.red = 0;
        user.exoticMatter.green = 0;
        user.exoticMatter.purple += 1;
        user.suits = [{id: 'basicspacesuit', name: 'Basic Spacesuit', icon: '👨‍🚀'}];
        user.ships = [{id: 'basicspaceship', name: 'Basic Spaceship', icon: '🚀'}];
        user.badges = [];
        user.inventory = [];
        user.planet = { id: 'moon', name: 'Moon', icon: '🌙'};
        user.suit = {id: 'basicspacesuit', name: 'Basic Spacesuit', icon: '👨‍🚀'};
        user.upgrades.collect.currentLevel = 0;
        user.upgrades.sellPrice.currentLevel = 0;
        user.upgrades.xp.currentLevel = 0;
        user.upgrades.spacejunk.currentLevel = 0;
        user.upgrades.spacejunkQuality.currentLevel = 0;
        await user.save();
        prestigeEmbed.setTitle(`Congratulations!`);
        prestigeEmbed.setDescription(`You're now Prestige **${prestige + 1}**!`);
      } else {
        prestigeEmbed.setTitle(`Error`);
        prestigeEmbed.setDescription('You don\'t meet the requirements to prestige.');
      }
      
      
      if (user.color) {
        prestigeEmbed.setColor(user.color.hex);
      }  

      message.lineReplyNoMention(prestigeEmbed);
    } else if (section.toLowerCase() === 'shop') {
      let description = `**${user.exoticMatter.purple}** Purple Exotic Matter <a:purpleexoticmatter:844649568557334558>\n`;
      description += `**Prodigal Astronaut** - 10% boost to every multiplier. - **${user.prestigeUpgrades.prodigalAstronaut}/1**\n`;
      description += `**Mogul** - 40% sell boost. - **${user.prestigeUpgrades.mogul}/1**\n`;
      description += `**Targeting System** - 25% more resources collected. - **${user.prestigeUpgrades.targetingSystem}/1**\n`;
      description += `**Brain Upgrade** - 35% more experience from all sources. - **${user.prestigeUpgrades.brainUpgrade}/1**\n`;
      const shopEmbed = new Discord.MessageEmbed()
        .setTitle(`Prestige Shop\nSpend your Purple Exotic Matter <a:purpleexoticmatter:844649568557334558> here! (${prefix}prestige buy)`)
        .setDescription(description)
      
      if (user.color) {
        shopEmbed.setColor(user.color.hex);
      }  
      message.lineReplyNoMention(shopEmbed);
    } else if (section.toLowerCase() === 'buy') {
      let choice = args.slice(1).join(' ');
      choice = choice.toLowerCase();
      const buyEmbed = new Discord.MessageEmbed();
      if (user.exoticMatter.purple < 1) {
        buyEmbed.setTitle('Error');
        buyEmbed.setDescription("You can't afford that.");
        if (user.color) {
          buyEmbed.setColor(user.color.hex);
        }  
        return message.lineReplyNoMention(buyEmbed);
      }
      let description = '';
      if (choice === 'prodigal astronaut' && user.prestigeUpgrades.prodigalAstronaut !== 1) {
        user.prestigeUpgrades.prodigalAstronaut = 1;
        user.exoticMatter.purple -= 1;
        description = 'You are now a **Prodigal Astronaut**!';
      } else if (choice === 'mogul' && user.prestigeUpgrades.mogul !== 1) {
        user.prestigeUpgrades.mogul = 1;
        user.exoticMatter.purple -= 1;
        description = 'You are now a **Mogul**!';
      } else if (choice === 'targeting system' && user.prestigeUpgrades.targetingSystem !== 1) {
        user.prestigeUpgrades.targetingSystem = 1;
        user.exoticMatter.purple -= 1;
        description = 'You now own a **Targeting System**!';
      } else if (choice === 'brain upgrade' && user.prestigeUpgrades.brainUpgrade !== 1) {
        user.prestigeUpgrades.brainUpgrade = 1;
        user.exoticMatter.purple -= 1;
        description = 'You got a **Brain Upgrade**!';
      } else {
        if (choice === 'prodigal astronaut' || choice === 'mogul' || choice === 'targeting system' || choice === 'brain upgrade') {
          description = 'You already own that upgrade';
        } else {
          description = "That's not a valid option."
        }
      }
      await user.save();
      buyEmbed.setDescription(description);
      if (user.color) {
        buyEmbed.setColor(user.color.hex);
      }  
      message.lineReplyNoMention(buyEmbed);
    }
  }
}