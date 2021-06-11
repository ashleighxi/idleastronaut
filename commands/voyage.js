const Discord = require('discord.js');
const mongoose = require('mongoose');
const userDB = require('../models/user');
const resourceDB = require('../models/resource');
const planetDB = require('../models/planet');
const suitDB = require('../models/suit');
const shipDB = require('../models/ship');
const spacejunkDB = require('../models/spacejunk');
const globalDB = require('../models/global');
const humanizeDuration = require('humanize-duration');
const e = require('express');

module.exports = {
  aliases: ['v'],
  name: 'voyage',
  category: 'Voyages',
  description: 'Collect resources on distant planets!',
  callback: async ({ message, client, prefix }) => {
    let cooldown = 3000;
    const voyageEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.username)
      .setTitle('You collected:')
    let collected = '';
    const user = await userDB.findOne({ id: message.author.id });
    
    if (user) {
      if (user.color) {
        voyageEmbed.setColor(user.color.hex);
      } else {
        voyageEmbed.setColor('#aeacb0');
      }
      if (user.hasVoted) {
        const userVotedEmbed = new Discord.MessageEmbed()
          .setTitle('Thanks for voting!')
          .setDescription('You received:\n2x **Personal Booster**\n1x **Global Booster**\n')
          if (user.color) {
            userVotedEmbed.setColor(user.color.hex);
          } else {
            userVotedEmbed.setColor('#aeacb0');
          }
        user.hasVoted = false;
        await message.channel.send(userVotedEmbed);
        await user.save();
      }
      const userPlanet = user.planet.id;
      const planet = await planetDB.findOne({ id: userPlanet });
      cooldown = planet.baseCooldown;
      const ships = user.ships;
      let userShips = [];
      for (let i = 0; i < ships.length; i++) {
        const shipCheck = await shipDB.findOne({ id: ships[i].id });
        if (shipCheck) {
          userShips.push(shipCheck);
          cooldown -= shipCheck.cdReduction;
        }
      }
        
     
      let lastVoyage = user.cooldowns.voyages;
      if (lastVoyage !== null && cooldown - (Date.now() - lastVoyage) > 0) {
        // If user still has a cooldown
        let timeObj = cooldown - (Date.now() - lastVoyage); // timeObj.hours = 12
        const cooldownEmbed = new Discord.MessageEmbed()
          .setDescription(`You must wait **${humanizeDuration(timeObj, {maxDecimalPoints: 2 })}** to collect more resources.\nYour cooldown: **${humanizeDuration(cooldown)}**`)
        if (user.color) {
          cooldownEmbed.setColor(user.color.hex);
        }
        return message.lineReplyNoMention(cooldownEmbed);
      } else {
        
        const resources = await resourceDB.find({ planet: userPlanet });
        let userBoosters = user.boosts;
        let collect = 5;
        let junk = 0;
        let xpGained = 0;
        let userLevel = user.level;
        let userXP = user.xp;
        let boostEnded = false;
        let boostType;
        let collectBoost = 0;
        let globalBoost;
        

        
        
        let userSuit = user.suit;
        const suit = await suitDB.findOne({ id: userSuit.id });
        let totalShipBoost = 0;
        for (let i = 0; i < userShips.length; i++) {
          totalShipBoost += userShips[i].boost;
        }
        let collectionMultiplier = user.multipliers.collect;
        collectionMultiplier += suit.boost * 0.1;
        collectionMultiplier += totalShipBoost * 0.1;
        collectionMultiplier += user.upgrades.collect.currentLevel * 0.02;
        userBoosters.forEach( boost => {
          if (boost.endTime < Date.now()) {
            boostEnded = true;
            boostType = boost.stat;
            let boostIndex = userBoosters.indexOf(boost);
            userBoosters.splice(boostIndex, 1);
          } else if (boost.stat === 'collect' && boost.count > 0) {
            collectionMultiplier += boost.boost;
          } else if (boost.stat === 'junk' && boost.count > 0) {
            junk += boost.boost;
          } else if (boost.stat === 'both' && boost.count > 0) {
            collectionMultiplier += boost.boost;
            junk += boost.boost;
          }
        });
        const global = await globalDB.findOne({ id: 'daily' });
        if (global) {
          let globalBoosts = global.globalBoost;
          if (globalBoosts) {
            if (globalBoosts.length > 0) {
              collectionMultiplier += 0.5;
              junk += 0.5;
              globalBoost = globalBoosts[0];
            } 
          }
          
        }
        collect += Math.floor((suit.boost + totalShipBoost) * collectionMultiplier);
        let rolls = Math.floor(Math.random() * ((collect + 5) - (collect - 5) + 1) + (collect - 5));
        let result = [];
        let potentialResources = [];
        let options = [];
        let amounts = []
        
        resources.forEach( resource => {
          for (let i = 0; i < resource.rarity; i++) {
            if (userLevel >= resource.level) {
              potentialResources.push(resource);
            }
          }
          options.push(resource);
          amounts.push(0);
        });

        for (let i = 0; i < rolls; i++) {
          let roll = Math.floor(Math.random() * (potentialResources.length + 1)) + suit.boost + totalShipBoost;
          if (roll > potentialResources.length) roll = potentialResources.length - 1;
          result[i] = potentialResources[roll];
          
          for (let x = 0; x < options.length; x++) {
            if (result[i] === options[x]) {
              amounts[x] += 1;
              xpGained += options[x].xp;
            }
          } 
        }

        for (let i = 0; i < options.length; i++) {
          if (amounts[i] > 0) {
            let resourceCheck = user.inventory.find( ({id}) => id === options[i].id);
            if (resourceCheck) {
              resourceCheck.count += amounts[i];
            } else {
              user.inventory.push({
                id: options[i].id,
                name: options[i].name,
                value: options[i].value, 
                count: amounts[i],
                icon: options[i].icon
              });
            }
            collected += `${amounts[i]} ${options[i].icon} ${options[i].name}\n`;
          }
        }

        let roll = Math.random();
        let spacejunkMultiplier = user.multipliers.spacejunk + (user.upgrades.spacejunk.currentLevel * 0.05) + junk;
        let rarity;
        let rarityMultiplier;
        if (roll * spacejunkMultiplier >= 0.9 - (user.upgrades.spacejunkQuality.currentLevel * 0.01)) {
          rarity = 'very rare';
          rarityMultiplier = 3;
        } else if (roll * spacejunkMultiplier >= 0.85 - (user.upgrades.spacejunkQuality.currentLevel * 0.01)) {
          rarity = 'rare';
          rarityMultiplier = 2;
        } else {
          rarity = 'skip';
        }
        
        if (rarity !== 'skip') {
          let spacejunks = await spacejunkDB.find({ rarity: rarity });
          let randomJunk = Math.floor(Math.random() * spacejunks.length);
          let spacejunk = spacejunks[randomJunk];
          if (spacejunk.reward === 'xp') {
            let reward = Math.floor(Math.random() * (xpGained * rarityMultiplier - xpGained + 1) + xpGained);
            collected += `You found some ${spacejunk.rarity} junk ${spacejunk.icon}\nYou got **${reward.toLocaleString()} XP** from the junk!\n`;
            xpGained += reward;
          } else if (spacejunk.reward === 'money') {
            let reward = Math.floor(Math.random() * (xpGained * rarityMultiplier - xpGained + 1) + xpGained);
            collected += `You found some ${spacejunk.rarity} junk ${spacejunk.icon}\nYou got **$${reward.toLocaleString()}** from the junk!\n`;
            user.balance += reward;
          } else if (spacejunk.reward === 'yellow') {
            let reward = Math.floor(Math.random() * ((rarityMultiplier + 1) - (rarityMultiplier - 1) + 1) + (rarityMultiplier - 1));
            collected += `You found some ${spacejunk.rarity} junk ${spacejunk.icon}\nYou got **${reward.toLocaleString()} Yellow Exotic Matter <a:yellowexoticmatter:844649686673653771>** from the junk!\n`;
            user.exoticMatter.yellow += reward;
          } else if (spacejunk.reward === 'green') {
            let reward = Math.floor(Math.random() * ((rarityMultiplier + 1) - (rarityMultiplier - 1) + 1) + (rarityMultiplier - 1));
            collected += `You found some ${spacejunk.rarity} junk ${spacejunk.icon}\nYou got **${reward.toLocaleString()} Green Exotic Matter <a:greenexoticmatter:844649631098339350>** from the junk!\n`;
            user.exoticMatter.green += reward;
          } else if (spacejunk.reward === 'red') {
            let reward = Math.floor(Math.random() * ((rarityMultiplier + 1) - (rarityMultiplier - 1) + 1) + (rarityMultiplier - 1));
            collected += `You found some ${spacejunk.rarity} junk ${spacejunk.icon}\nYou got **${reward.toLocaleString()} Red Exotic Matter <a:redexoticmatter:844649513346924584>** from the junk!\n`;
            user.exoticMatter.red += reward;
          }
        }
        
        if (user.upgrades.xp.currentLevel > 0 || user.prestigeUpgrades.brainUpgrade > 0) {
          xpGained = Math.floor(xpGained * (1 + (user.upgrades.xp.currentLevel * 0.1) + (user.prestigeUpgrades.brainUpgrade * 0.35)));
        }
        
        collected += `+${xpGained.toLocaleString()} XP\n`;
        if (globalBoost) {
          collected += `Global boost by **${globalBoost.booster}**\n`
        }
        user.experience += xpGained;
        const needed = await getNeededXP(userLevel);
        if (user.experience >= needed) {
          user.level++;
          user.experience -= needed;
          collected += `\n**🚀Congratulations!🚀**\nYou are now level ${user.level}!\nYou receive $${(needed * 4).toLocaleString()} for leveling up!\n`;
          user.balance += needed * 4;
          let planetCheck = await planetDB.findOne({ level: user.level });
          if (planetCheck) {
            collected += `You've unlocked ${planetCheck.icon} ${planetCheck.name}! **${prefix}planet ${planetCheck.id}**\n`;
          }
        }
        if (boostEnded) {
          if (boostType === 'collect' || boostType === 'junk') {
            collected += `Your ${boostType} boost has ended!\n`;
          } else {
            collected += `Your personal booster has ended!\n`;
          }
          
        }
        voyageEmbed.setDescription(collected);
        user.cooldowns.voyages = Date.now();
        await user.save();
        await message.lineReplyNoMention(voyageEmbed);
      }
    } else {
      const welcomeEmbed = new Discord.MessageEmbed()
        .setTitle('Welcome to Idle Astronaut!')
        .setDescription('Your profile has been created for you! To view commands, type `' + prefix + 'help`. Get started right away by typing `' + prefix + 'voyage`!')
        .setFooter('Thank for using my bot :) - rev')
        .setColor("RANDOM");
      await message.lineReplyNoMention(welcomeEmbed);
      const user = new userDB({
        id: message.author.id,
        cooldowns: {
          voyages: Date.now()
        },
        suits: [{
          id: 'basicspacesuit',
          name: 'Basic Spacesuit'
        }],
        ships: [{
          id: 'basicspaceship',
          name: 'Basic Spaceship'
        }],
        planet: {
          id: 'moon',
          name: 'Moon'
        },
        suit: {
          id: 'basicspacesuit',
          name: 'Basic Spacesuit'
        },
      });
      await user.save();
      
      }
      
    }
    
}


const getNeededXP = async level => level * level * 50;