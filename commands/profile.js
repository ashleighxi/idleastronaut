const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
module.exports = {
  aliases: ['p'],
  name: 'profile',
  category: 'Voyages',
  cooldown: '1s',
  description: 'View your profile and see your balance',
  minArgs: 0,
  maxArgs: 1,
  callback: async ({ message, client, prefix, args }) => {
    let user;
    if (args[0]) {
      let target = message.mentions.members.first() || await message.guild.members.cache.get(args[0]);
      if (!target) {
        return message.lineReplyNoMention("I couldn't find that user.");
      } else {
        user = target.user;
      }
    } else {
      user = message.author;
    }
    const profile = await userDB.findOne({ id: user.id });
    let needed = await getNeededXP(profile.level);
    if (!profile) return message.lineReplyNoMention("I couldn't find that user in my database.");
    let description = '';
    description += `Balance: **$${profile.balance.toLocaleString()}**\n`;
    if (profile.prestige > 0) {
      description += `Level: **P${profile.prestige} ${profile.level.toLocaleString()}**\n`;
    } else {
      description += `Level: **${profile.level.toLocaleString()}**\n`;
    }
    description += `Experience: ${profile.experience.toLocaleString()}/${needed.toLocaleString()} XP\n`;
    description += `Currently using ${profile.suit.icon} **${profile.suit.name}**\n`;
    description += `Current Planet: ${profile.planet.icon} **${profile.planet.name}**\n\n`;
    description += `**Inventory**\n`;
    let value = 0;

    profile.inventory.forEach( resource => {
      description += `**${resource.count}** ${resource.icon} ${resource.name}\n`;
      if (profile.upgrades.sellPrice.currentLevel > 0) {
        let multiplier = profile.multipliers.sellPrice + (profile.upgrades.sellPrice.currentLevel * 0.05);
          if (profile.prestigeUpgrades.mogul > 1) {
            multiplier += 0.4;
            value += Math.floor(resource.count * resource.value * multiplier);
          } else {
            value += Math.floor(resource.count * resource.value * multiplier);
          }
      } else {
        value += Math.floor(resource.count * resource.value);
      }
      
    });
    description += `Resource Value: **$${value.toLocaleString()}**\n\n`;
    description += `**Exotic Matter**\n**${profile.exoticMatter.yellow}** <a:yellowexoticmatter:844649686673653771> Yellow Exotic Matter\n**${profile.exoticMatter.green}** <a:greenexoticmatter:844649631098339350> Green Exotic Matter\n**${profile.exoticMatter.red}** <a:redexoticmatter:844649513346924584> Red Exotic Matter\n**${profile.exoticMatter.purple}** <a:purpleexoticmatter:844649568557334558> Purple Exotic Matter`;
    const profileEmbed = new Discord.MessageEmbed()
      .setTitle(user.username)
      .setDescription(description)
    if (profile.color) {
      profileEmbed.setColor(profile.color.hex);
    }
    await message.lineReplyNoMention(profileEmbed);
  }
}

const getNeededXP = async level => level * level * 50;