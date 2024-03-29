const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
module.exports = {
  aliases: ['support'],
  name: 'invite',
  category: 'Utility',
  cooldown: '1s',
  description: 'Provides the link to invite Idle Astronaut.',
  callback: async ({ message, client, prefix, args }) => {
    const inviteEmbed = new Discord.MessageEmbed();
    const user = await userDB.findOne({ id: message.author.id });
    if (user && user.color) {
      inviteEmbed.setColor(user.color.hex);
    } else {
      inviteEmbed.setColor("RANDOM");
    }
    inviteEmbed.setTitle("Invite Idle Astronaut!");
    inviteEmbed.setDescription(`Invite Link: https://dsc.gg/idleastronaut \nSupport Server Link: https://discord.gg/Ay4ZjDxv4H`);
    inviteEmbed.setFooter('Thanks for using my bot :) - rev');
    message.lineReplyNoMention(inviteEmbed);
  }
}