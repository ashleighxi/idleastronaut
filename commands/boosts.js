const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
const globalDB = require('../models/global');
const humanizeDuration = require('humanize-duration');
module.exports = {
  aliases: [],
  name: 'boosts',
  category: 'Voyages',
  cooldown: '1s',
  description: 'Shows active boosts.',
  callback: async ({ message, client, prefix, args }) => {
    const boostsEmbed = new Discord.MessageEmbed();
    const user = await userDB.findOne({ id: message.author.id });
    const global = await globalDB.findOne({ id: 'daily' });
    let description = '';
    if (user && user.color) {
      boostsEmbed.setColor(user.color.hex);
    } else {
      boostsEmbed.setColor("RANDOM");
    }
    user.boosts.forEach( boost => {
      if (boost.count > 0) {
        let timeRemaining = boost.endTime - Date.now();
        description += `${boost.name}: **${humanizeDuration(timeRemaining, { units: ['m','s'], round: true })}**\n`; 
      }
    })
    if (global) {
      let boosts = global.globalBoost;
      if (boosts) {
        if (boosts.length > 0) {
          let endTime = boosts[boosts.length - 1].endTime;
          let booster = boosts[0].booster;
          let timeRemaining = endTime - Date.now();
          description += `Global Boost: **${humanizeDuration(timeRemaining, { units: ['h','m','s'], round: true })}**\nCurrent Booster: **${booster}**`;
        }
      }
      
    }
    boostsEmbed.setTitle("Boosts");
    boostsEmbed.setDescription(description);
    message.lineReplyNoMention(boostsEmbed);
  }
}