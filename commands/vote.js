const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
module.exports = {
  aliases: [],
  name: 'vote',
  category: 'Utility',
  cooldown: '1s',
  description: 'Provides the link to vote for/invite Idle Astronaut.',
  callback: async ({ message, client, prefix, args }) => {
    const inviteEmbed = new Discord.MessageEmbed();
    const user = await userDB.findOne({ id: message.author.id });
    if (user && user.color) {
      inviteEmbed.setColor(user.color.hex);
    } else {
      inviteEmbed.setColor("RANDOM");
    }
    inviteEmbed.setTitle("Vote for Idle Astronaut!");
    inviteEmbed.setDescription(`**VOTE TO RECIEVE 2 PERSONAL BOOSTERS AND 1 GLOBAL BOOSTER**\nTop.gg: https://top.gg/bot/841450235960229919/vote\nDiscord Bot List: https://discord.ly/idle-astronaut/upvote\n\nInvite Link: https://dsc.gg/idleastronaut \nSupport Server Link: https://discord.gg/Ay4ZjDxv4H`);
    inviteEmbed.setFooter('Thanks for using my bot :) - rev');
    message.lineReplyNoMention(inviteEmbed);
  }
}