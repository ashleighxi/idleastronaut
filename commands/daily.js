const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
const globalDB = require('../models/global');
const humanizeDuration = require('humanize-duration');
module.exports = {
  aliases: ['d'],
  name: 'daily',
  category: 'Voyages',
  description: 'Get a daily boost',
  callback: async ({ message, client, prefix, args }) => {
    const dailyEmbed = new Discord.MessageEmbed();
    const user = await userDB.findOne({ id: message.author.id });
    const daily = await globalDB.findOne({ id: 'daily' });
    if (user && user.color) {
      dailyEmbed.setColor(user.color.hex);
    } else {
      dailyEmbed.setColor("RANDOM");
    }
    let lastDaily = user.cooldowns.daily;
    if (lastDaily !== null && lastDaily > daily.cooldown - (3600000 * 24)) {
      // If user still has a cooldown
      let timeObj = (daily.cooldown) - (Date.now());
      const cooldownEmbed = new Discord.MessageEmbed()
        .setDescription(`You must wait **${humanizeDuration(timeObj, {maxDecimalPoints: 0 })}** to collect your daily again.\nDaily resets at 0:00 UTC`)
      if (user.color) {
        cooldownEmbed.setColor(user.color.hex);
      }
      return message.lineReplyNoMention(cooldownEmbed);
    } else {
      let levelXP = await getNeededXP(user.level);
      let cashReward = Math.floor(levelXP * 4);
      user.balance += cashReward;
      let description = `+$${cashReward.toLocaleString()}\n`;
      let xpReward = Math.floor(levelXP/4);
      user.experience += xpReward;
      description += `+${xpReward.toLocaleString()} XP\n`;
      if (user.experience >= levelXP) {
        user.level++;
        user.experience -= levelXP;
        description += `\n\n**🚀Congratulations!🚀**\nYou are now level ${user.level}!\n You receive $${(levelXP * 4).toLocaleString()} for leveling up!`;
        user.balance += levelXP * 4;
      }
      user.cooldowns.daily = Date.now();
      await user.save();
      dailyEmbed.setTitle("Daily Collected:");
      dailyEmbed.setDescription(description);
      message.lineReplyNoMention(dailyEmbed);
    }
  }
}

const getNeededXP = async level => level * level * 50;