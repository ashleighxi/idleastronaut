const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
module.exports = {
  aliases: ['i'],
  name: 'info',
  category: 'Utility',
  cooldown: '1s',
  description: 'Shows information about the bot, including server and user count.',
  callback: async ({ message, client, prefix, args }) => {
    const infoEmbed = new Discord.MessageEmbed();
    const user = await userDB.findOne({ id: message.author.id });
    if (user && user.color) {
      infoEmbed.setColor(user.color.hex);
    } else {
      infoEmbed.setColor("RANDOM");
    }
    infoEmbed.setTitle("Idle Astronaut Info");
    infoEmbed.setDescription(`Server Count: \`${client.guilds.cache.size}\`\nUser Count: \`${client.users.cache.size}\``);
    infoEmbed.setFooter('Thanks for using my bot :) - rev');
    message.lineReplyNoMention(infoEmbed);
  }
}