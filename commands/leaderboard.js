const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
module.exports = {
  aliases: ['lb'],
  name: 'leaderboard',
  category: 'Voyages',
  cooldown: '1s',
  minArgs: 0,
  maxArgs: 1,
  description: 'Displays a leaderboard of current users. Use `{PREFIX}lb rich` to see the richest users',
  callback: async ({ message, client, prefix, args }) => {
    const leaderboardEmbed = new Discord.MessageEmbed();
    const users = await userDB.find({});
    const user = await userDB.findOne({ id: message.author.id });
    if (user && user.color) {
      leaderboardEmbed.setColor(user.color.hex);
    } else {
      leaderboardEmbed.setColor("RANDOM");
    }
    let choice = args[0];
    if (choice && choice.toLowerCase() === 'rich') {
      leaderboardEmbed.setTitle("Balance Leaderboard");
      users.sort( (a,b) => {
        return b.balance - a.balance;
      });
      let topTen = 10;
      if (users.length < topTen) {
        topTen = users.length;
      }
      let description = '';
      for (let i = 0; i < topTen; i++) {
        description += `${i + 1}. <@!${users[i].id}> - $${users[i].balance.toLocaleString()}\n`;
      }
      leaderboardEmbed.setDescription(description);
      message.lineReplyNoMention(leaderboardEmbed);
    } else {
      leaderboardEmbed.setTitle("Level Leaderboard");
      users.sort( (a,b) => {
        return b.prestige - a.prestige || b.level - a.level;
      });
      let topTen = 10;
      if (users.length < topTen) {
        topTen = users.length;
      }
      let description = '';
      for (let i = 0; i < topTen; i++) {
        if (users[i].prestige > 0) {
          description += `${i + 1}. <@!${users[i].id}> - P${users[i].prestige} Level ${users[i].level.toLocaleString()}\n`;
        } else {
          description += `${i + 1}. <@!${users[i].id}> - Level ${users[i].level.toLocaleString()}\n`;
        }
        
      }
      leaderboardEmbed.setDescription(description);
      message.lineReplyNoMention(leaderboardEmbed);
    }
  }
}