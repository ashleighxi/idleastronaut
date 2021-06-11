const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
module.exports = {
  aliases: [],
  name: 'boosters',
  category: 'Voyages',
  cooldown: '1s',
  description: 'Shows booster inventory.',
  callback: async ({ message, client, prefix, args }) => {
    const boostsEmbed = new Discord.MessageEmbed();
    const user = await userDB.findOne({ id: message.author.id });
    let personals = 0;
    let globals = 0;
    let description = '';
    if (user && user.color) {
      boostsEmbed.setColor(user.color.hex);
    } else {
      boostsEmbed.setColor("RANDOM");
    }
    user.boosters.forEach( boost => {
      if (boost.id === 'personal') {
        personals++;
      } else if (boost.id === 'global') {
        globals++;
      }
    });
    description += `Personal Boosters: **${personals.toLocaleString()}**\nGlobal Boosters: **${globals.toLocaleString()}**\n`;
    boostsEmbed.setTitle("Boosters");
    boostsEmbed.setDescription(description);
    message.lineReplyNoMention(boostsEmbed);
  }
}