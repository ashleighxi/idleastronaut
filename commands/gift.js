const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
module.exports = {
  name: 'gift',
  category: 'Utility',
  description: 'For gifting winners of giveaways',
  minArgs: 3,
  maxArgs: 3,
  cooldown: '2s',
  hidden: true,
  ownerOnly: true,
  guildOnly: true,
  callback: async ({message, client, args, prefix}) => {
    const giftEmbed = new Discord.MessageEmbed();
    giftEmbed.setColor('RANDOM');
    let amount = args[0];
    let choice = args[1];
    let target = message.mentions.members.first() || message.guild.members.cache.get(args[2]);
    
    if (isNaN(amount)) {
      giftEmbed.setDescription(`Please provide a number of an item to gift. \`${prefix}gift <amount> <booster_type> <user>\``);
      return message.lineReplyNoMention(giftEmbed);
    }
    if (!target) {
      giftEmbed.setDescription(`Please provide a valid user to gift to. \`${prefix}gift <amount> <booster_type> <user>\``);
      return message.lineReplyNoMention(giftEmbed);
    } else {
      target = target.user;
    }
    const user = await userDB.findOne({ id: target.id })
    if (!user) {
      giftEmbed.setDescription(`Please provide a valid user to gift to. \`${prefix}gift <amount> <booster_type> <user>\``);
      return message.lineReplyNoMention(giftEmbed);
    } else {
      if (choice === 'personal') {
        const boost = {
          id: 'personal',
          name: 'Personal Booster'
        };
        for (let i = 0; i < amount; i++) {
          await user.boosters.push(boost);
        }
        await user.save();
        giftEmbed.setDescription(`You've gifted ${amount.toLocaleString()} Personal Boosters to <@${user.id}>!`);
        message.lineReplyNoMention(giftEmbed);
      } else if (choice === 'global') {
        const boost = {
          id: 'global',
          name: 'Global Booster'
        };
        for (let i = 0; i < amount; i++) {
          await user.boosters.push(boost);
        }
        await user.save();
        giftEmbed.setDescription(`You've gifted ${amount.toLocaleString()} Global Boosters to <@${user.id}>!`);
        message.lineReplyNoMention(giftEmbed);
      } else {
        giftEmbed.setDescription(`Please provide a valid gift. \`${prefix}gift <amount> <booster_type> <user>\``);
        return message.lineReplyNoMention(giftEmbed);
      }
    }
  }
}