const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
const planetDB = require('../models/planet');
module.exports = {
  aliases: [],
  name: 'planet',
  category: 'Voyages',
  cooldown: '1s',
  description: 'Continue your journey on a different planet!',
  minArgs: 0,
  maxArgs: 1,
  callback: async ({ message, client, prefix, args }) => {
    const user = await userDB.findOne({ id: message.author.id });
    const planets = await planetDB.find({});
    const planetEmbed = new Discord.MessageEmbed()
    planetEmbed.setColor("RANDOM");
    let choice = args[0];
    if (choice && user) {
      let planet = planets.find( ({id}) => id === choice.toLowerCase());
      if (planet) {
        if (user.level < planet.level) {
          planetEmbed.setDescription(`You must be **level ${planet.level}** to travel to ${planet.icon} **${planet.name}**.`);
          
          return message.lineReplyNoMention(planetEmbed);
        }
        user.planet.id = planet.id;
        user.planet.name = planet.name;
        user.planet.icon = planet.icon;
        await user.save();
        planetEmbed.setDescription(`You're now searching for resources on ${planet.icon} **${planet.name}**!`);
        message.lineReplyNoMention(planetEmbed);
      } else {
        planetEmbed.setDescription("That isn't a valid planet...")
        message.lineReplyNoMention(planetEmbed);
      }
    } else if (user) {
      planetEmbed.setTitle(`Current Planet: ${user.planet.name}`);
      let description = 'Your unlocked planets:\n';
      planets.every( planet => {
        if (planet.level <= user.level) {
          description += `${planet.icon} **${planet.name}**\n`;
          return true;
        } else {
          description += `\nNext Planet: ${planet.icon} **${planet.name}**\nUnlocked at **level ${planet.level}**!`;
          return false;
        }
      });
      planetEmbed.setDescription(description);
      message.lineReplyNoMention(planetEmbed);
    }
  }
}