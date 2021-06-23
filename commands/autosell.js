const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
module.exports = {
  aliases: [],
  name: 'autosell',
  category: 'Voyages',
  cooldown: '1s',
  description: 'allows you to enable and disable auto-sell - **Premium Required**',
  callback: async ({ message, client, prefix, args }) => {
    const boostsEmbed = new Discord.MessageEmbed();
    const user = await userDB.findOne({ id: message.author.id });
    let autosell = user.autoSell;
    if (autosell === undefined) autosell = false;
    let description = '';
    if (user && user.color) {
      boostsEmbed.setColor(user.color.hex);
    } else {
      boostsEmbed.setColor("RANDOM");
    }
    let choice = args[0];
    if (choice === 'enable' || choice === 'on') {
      if (user.premium === undefined || user.premium === false) {
        description += `❌ This action requires a premium account.`;
      } else {
        user.autoSell = true;
        await user.save();
        description += '✅ Auto-sell Enabled!';
      }
      
    } else if (choice === 'disable' || choice === 'off') {
      if (user.premium === undefined || user.premium === false) {
        description += `❌ This action requires a premium account.`;
      } else {
        user.autoSell = false;
        await user.save();
        description += '✅ Auto-sell Disabled!';
      }
      
    } else {
      let state;
      if (user.autoSell) state = 'ENABLED ✅ ';
      if (!user.autoSell) state = 'DISABLED ❌'
      description += `Auto-sell status: **${state}**`;
    }
    
    boostsEmbed.setDescription(description);
    message.lineReplyNoMention(boostsEmbed);
  }
}