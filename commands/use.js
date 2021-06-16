const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
const colorDB = require('../models/color');
const globalDB = require('../models/global');
module.exports = {
  aliases: [],
  name: 'use',
  category: 'Voyages',
  cooldown: '1s',
  description: 'Use an item',
  minArgs: 1,
  callback: async ({ message, client, prefix, args }) => {
    let booster = args[0];
    let user = await userDB.findOne({ id: message.author.id });
    const useEmbed = new Discord.MessageEmbed();
    if (user) {
      if (user && user.color) {
        useEmbed.setColor(user.color.hex);
      } else {
        useEmbed.setColor("RANDOM");
      }
      let boosters = user.boosters;
      let boosts = user.boosts;
      if (booster === 'personal') {
        let boosterCheck = boosters.find(({id}) => id === 'personal');
        let currentlyBoosting = boosts.find(({id, count}) => id === 'personal' && count > 0);
        if (currentlyBoosting) {
          useEmbed.setDescription(`❌ You already have an active booster.`);
          return message.lineReplyNoMention(useEmbed);
        }
        if (boosterCheck) {
          let boost = {
            id: 'personal',
            name: 'Personal Booster',
            boost: 0.5,
            stat: 'both',
            count: 1,
            startTime: Date.now(),
            endTime: Date.now() + (1000 * 60 * 10)
          }
          await boosts.push(boost);
          let boosterIndex = boosters.indexOf(boosterCheck);
          await boosters.splice(boosterIndex, 1);
          useEmbed.setDescription(`✅ Personal Booster Activated!`);
          message.lineReplyNoMention(useEmbed);
          await user.save();
        } else {
          useEmbed.setDescription(`❌ You have no personal boosters to use.`);
          message.lineReplyNoMention(useEmbed);
        }
      } else if (booster === 'global') {
        let boosterCheck = boosters.find(({id}) => id === 'global');
        if (boosterCheck) {
          let globals = await globalDB.findOne({ id: 'daily' });
          let currentBoosts = globals.globalBoost;
          let boost;
          if (currentBoosts.length > 0) {
            boost = {
              id: 'global',
              name: 'Global Booster',
              startTime: currentBoosts[currentBoosts.length - 1].endTime,
              endTime: currentBoosts[currentBoosts.length - 1].endTime + (1000 * 60 * 60),
              booster: message.author.tag
            }
          } else {
            boost = {
              id: 'global',
              name: 'Global Booster',
              startTime: Date.now(),
              endTime: Date.now() + (1000 * 60 * 60),
              booster: message.author.tag
            }
          }
          
          await globals.globalBoost.push(boost);
          let boosterIndex = boosters.indexOf(boosterCheck);
          await boosters.splice(boosterIndex, 1);
          useEmbed.setDescription(`✅ Global Booster added to queue!`);
          message.lineReplyNoMention(useEmbed);
          let boostChannel = client.channels.cache.get('854724889269633035');
          boostChannel.send(`Global boost activated by **${message.author.tag}**!`).then( message => {
            message.react('854726625009860608')
          }).catch(err => console.log(err));
          await globals.save();
          await user.save();
        } else {
          useEmbed.setDescription(`❌ You have no global boosters to use.`);
          message.lineReplyNoMention(useEmbed);
        }
      } else {
        useEmbed.setDescription(`❌ That is not a valid booster.`);
        message.lineReplyNoMention(useEmbed);
      }
      
    }
  }
}