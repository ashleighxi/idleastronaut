const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
const colorDB = require('../models/color');
module.exports = {
  aliases: ['colour'],
  name: 'color',
  category: 'Voyages',
  cooldown: '1s',
  description: 'Change the color of your embeds for the bot.',
  minArgs: 0,
  callback: async ({ message, client, prefix, args }) => {
    const user = await userDB.findOne({ id: message.author.id });
    const colors = await colorDB.find({});
    const colorEmbed = new Discord.MessageEmbed()
    let choice = args.join(' ');
    if (choice && user) {
      if (user.color) {
        colorEmbed.setColor(user.color.hex);
      }
      let color = colors.find( ({id, name}) => id.toLowerCase() === choice.toLowerCase() || name.toLowerCase() === choice.toLowerCase());
      if (color) {
        if (user.level < color.level && user.prestige === 0) {
          
          colorEmbed.setDescription(`You don't meet the requirements to use **${color.name}**.`);
          
          return message.lineReplyNoMention(colorEmbed);
        }
        if (user.prestige < color.prestige) {
          colorEmbed.setDescription(`You don't meet the requirements to use **${color.name}**.`);
        
          return message.lineReplyNoMention(colorEmbed);
        }
        user.color.id = color.id;
        user.color.name = color.name;
        user.color.hex = color.hex;
        await user.save();
        colorEmbed.setDescription(`You're now using **${color.name}**!`);
        colorEmbed.setColor(user.color.hex);
        message.lineReplyNoMention(colorEmbed);
      } else {
        colorEmbed.setDescription("That isn't a valid color...")
        message.lineReplyNoMention(colorEmbed);
      }
    } else if (user) {
      if (user.color) {
        colorEmbed.setColor(user.color.hex);
      }
      colorEmbed.setTitle(`Current Color: ${user.color.name}`);
      let description = 'Your unlocked colors:\n';
      colors.every( color => {
        if (color.level <= user.level || color.prestige <= user.prestige) {
          if (color.prestige) {
            description += `**${color.name}** - Prestige ${color.prestige}\n`;
          } else {
            description += `**${color.name}** - Level ${color.level}\n`;
          }
          
          return true;
        } else {
          if (color.level > user.level && user.prestige > 0) {
            description += `**${color.name}** - Level ${color.level}\n`;
            return true;
          }
          if (color.prestige) {
            description += `\nNext Color: **${color.name}**\nUnlocked at **Prestige ${color.prestige}**!`;
          } else {
            description += `\nNext Color: **${color.name}**\nUnlocked at **level ${color.level}**!`;
          }
          
          return false;
        }
      });
      colorEmbed.setDescription(description);
      message.lineReplyNoMention(colorEmbed);
    }
  }
}