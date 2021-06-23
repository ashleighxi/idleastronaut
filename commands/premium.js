const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
module.exports = {
  name: 'premium',
  category: 'Utility',
  description: 'For adding and removing premium benefits from users.',
  minArgs: 2,
  maxArgs: 2,
  cooldown: '2s',
  hidden: true,
  ownerOnly: true,
  guildOnly: true,
  callback: async ({message, client, args, prefix}) => {
    const premiumEmbed = new Discord.MessageEmbed();
    premiumEmbed.setColor('RANDOM');
    let choice = args[0];
    let target = message.mentions.members.first() || await message.guild.members.cache.get(args[1]);
    if (target) {
      target = target.user;
    } else {
      premiumEmbed.setDescription(`I couldn't find that user anywhere on discord.`);
      return message.lineReplyNoMention(premiumEmbed);
    }
    let user = await userDB.findOne({ id: target.id });
    if (!user) {
      premiumEmbed.setDescription(`I couldn't find that user in my database.`);
      return message.lineReplyNoMention(premiumEmbed);
    } else {
      if (choice === 'add') {
        user.premium = true;
        await user.save()
        premiumEmbed.setDescription(`Premium added to user ${target.tag}.`);
      } else if (choice === 'remove') {
        user.premium = false;
        await user.save();
        premiumEmbed.setDescription(`Premium removed from user ${target.tag}.`);
      } else {
        premiumEmbed.setDescription(`Please choose an action: \`${prefix}premium <add/remove> <user>\``);
        return message.lineReplyNoMention(premiumEmbed);
      }
      message.lineReplyNoMention(premiumEmbed);
    }

  }
}