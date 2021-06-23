const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
const blacklistDB = require('../models/blacklist');
const humanizeDuration = require('humanize-duration');
const ms = require('ms');
module.exports = {
  name: 'blacklist',
  aliases: ['blist'],
  category: 'Utility',
  description: 'For blacklisting users.',
  minArgs: 2,
  cooldown: '2s',
  hidden: true,
  ownerOnly: true,
  guildOnly: true,
  callback: async ({message, client, args, prefix}) => {
    const blacklistEmbed = new Discord.MessageEmbed();
    blacklistEmbed.setColor('RANDOM');
    let choice = args[0];
    let length
    if (args[2]) length = ms(args[2]);
    let reason = args.slice(3).join(' ')
    let target = message.mentions.members.first() || await message.guild.members.cache.get(args[1]);
    if (target) {
      target = target.user;
    } else {
      blacklistEmbed.setDescription(`I couldn't find that user anywhere on discord.`);
      return message.lineReplyNoMention(blacklistEmbed);
    }
    let user = await userDB.findOne({ id: target.id });
    if (!user) {
      blacklistEmbed.setDescription(`I couldn't find that user in my database.`);
      return message.lineReplyNoMention(blacklistEmbed);
    } else {
      if (choice === 'add') {
        if (isNaN(length)) {
          blacklistEmbed.setDescription(`Please provide a proper length of time: \`${prefix}blacklist <add/remove/status> <user> (time)\``);
          return message.lineReplyNoMention(blacklistEmbed);
        }
        if (!reason) reason = '';
        let banned = new blacklistDB({
          id: user.id,
          startDate: Date.now(),
          endDate: Date.now() + length,
          reason: reason
        })
        await banned.save()
        blacklistEmbed.setDescription(`${target.tag} blacklisted for ${humanizeDuration(banned.endDate - banned.startDate)}.\nReason: ${reason}`);
        target.send(blacklistEmbed);
      } else if (choice === 'remove') {
        let blacklisted = await blacklistDB.findOne({ id: user.id });
        if (!blacklisted) {
          blacklistEmbed.setDescription(`This user is not blacklisted.`);
          return message.lineReplyNoMention(blacklistEmbed);
        } else {
          let blacklistDel = await blacklistDB.findOneAndDelete({ id: user.id });
          blacklistEmbed.setDescription(`${target.tag} has been cleared from the blacklist.`);
        }  
      } else if (choice === 'status') {
        let blacklisted = await blacklistDB.findOne({ id: user.id });
        if (!blacklisted) {
          blacklistEmbed.setDescription(`This user is not blacklisted.`);
          return message.lineReplyNoMention(blacklistEmbed);
        } else {
          let timeLeft = blacklisted.endDate - Date.now();
          let reason = blacklisted.reason;
          blacklistEmbed.setDescription(`**${target.tag}**\nTime on blacklist remaining: **${humanizeDuration(timeLeft)}**\nReason: ${reason}`);
        }  
      } else {
        blacklistEmbed.setDescription(`Please choose an action: \`${prefix}blacklist <add/remove/status> <user> (time)\``);
        return message.lineReplyNoMention(blacklistEmbed);
      }
      message.lineReplyNoMention(blacklistEmbed);
    }

  }
}