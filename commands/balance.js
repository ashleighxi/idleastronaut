const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
module.exports = {
  aliases: ['bal'],
  name: 'balance',
  category: 'Voyages',
  cooldown: '1s',
  description: 'See your balance',
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
    if (!profile) return message.lineReplyNoMention("I couldn't find that user in my database.");
    let description = '';
    description += `Balance: **$${profile.balance.toLocaleString()}**\n`;
    const balanceEmbed = new Discord.MessageEmbed()
      .setTitle(user.username)
      .setDescription(description)
    if (profile.color) {
      balanceEmbed.setColor(profile.color.hex);
    }
    await message.lineReplyNoMention(balanceEmbed);
  }
}
