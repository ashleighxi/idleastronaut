const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
const suitsDB = require('../models/suit');
module.exports = {
  aliases: [],
  name: 'suit',
  category: 'Voyages',
  cooldown: '1s',
  description: 'Choose the spacesuit you would like to use.',
  minArgs: 0,
  callback: async ({ message, client, prefix, args }) => {
    const user = await userDB.findOne({ id: message.author.id });
    const suits = await suitsDB.find({});
    const suitEmbed = new Discord.MessageEmbed()
    
    let choice = args.join(' ');
    if (user.color) {
      suitEmbed.setColor(user.color.hex);
    }
    if (choice && user) {
      let suit = suits.find( ({id, name}) => id === choice.toLowerCase() || name.toLowerCase() === choice.toLowerCase());
      if (suit) {
        let suitCheck = user.suits.find(({id}) => id === suit.id);
        if (!suitCheck) {
          suitEmbed.setDescription(`You don't own ${planet.icon} **${planet.name}**.`);
          
          return message.lineReplyNoMention(suitEmbed);
        }
        user.suit.id = suit.id;
        user.suit.name = suit.name;
        user.suit.icon = suit.icon;
        await user.save();
        suitEmbed.setDescription(`You're now wearing ${suit.icon} **${suit.name}**!`);
        message.lineReplyNoMention(suitEmbed);
      } else {
        suitEmbed.setDescription("That isn't a valid suit...")
        message.lineReplyNoMention(suitEmbed);
      }
    } else if (user) {
      suitEmbed.setTitle(`Current Suit: ${user.suit.name}`);
      let description = 'Your unlocked suits:\n';
      suits.every( suit => {
        let suitCheck = user.suits.find(({id}) => id === suit.id);
        if (suitCheck) {
          description += `${suit.icon} **${suit.name}**\n`;
          return true;
        } else {
          return false;
        }
      });
      suitEmbed.setDescription(description);
      message.lineReplyNoMention(suitEmbed);
    }
  }
}