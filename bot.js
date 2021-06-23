const DiscordJS = require('discord.js');
const WOKCommands = require('wokcommands');
const mongoose = require('mongoose');
const dbots = require('dbots');
const DBotHook = require('dbothook');
const express = require('express');
require('dotenv').config();
require('discord-reply');
const cron = require('node-cron');
const globalDB = require('./models/global');
const blacklistDB = require('./models/blacklist');
const client = new DiscordJS.Client( {
  partials: ['MESSAGE', 'REACTION'],
});
const app = express();
const port = 3000;


client.on('ready', () => {
  const messagesPath = '';
  const dbOptions = {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
  mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));;
  const disableDefaultCommands = ['language', 'requiredrole'];

  new WOKCommands(client, {
    commandsDir: 'commands',
    featuresDir: 'features',
    messagesPath,
    showWarns: true,
    del: -1,
    dbOptions,
    disableDefaultCommands
  })
    .setBotOwner(['206982524021243914', '657779629246906369'])
    .setDisplayName('Idle Astronaut')
    .setMongoPath(process.env.MONGO_URI)
    .setDefaultPrefix('a')
    .setCategorySettings([
    {
      name: 'Utility',
      emoji: '🛠️'
    },
    {
      name: 'Voyages',
      emoji: '🚀'
    }
    ])
    .setColor(0x2FFAE9);
    const poster = new dbots.Poster({
      client,
      apiKeys: {
        discordbotlist: process.env.DBL,
        spacebotslist: process.env.SPACE,
        topgg: process.env.TOPGG
      },
      clientLibrary: 'discord.js'
    });
    poster.startInterval();

    cron.schedule('0 20 * * *', async () => {
      //set cooldown to now
      let global = await globalDB.findOne({ id: 'daily' });
      if (global) {
        console.log(global.cooldown);
        console.log('running cron job');
        global.cooldown = Date.now() + (3600000 * 24);
        await global.save().catch(err => console.log(err));
      } else {
        global = new globalDB({
          cooldown: Date.now(),
          id: 'daily'
        });
        await global.save();
      }
    }, {
      scheduled: true,
      timezone: 'America/New_York'
    });

    cron.schedule('1 * * * * *', async () => {
      let global = await globalDB.findOne({ id: 'daily' });
      if (global) {
        let boosts = global.globalBoost;
        if (boosts.length > 0) {
          let currentBoost = boosts[0];
          if (Date.now() > currentBoost.endTime) {
            boosts.shift();
            await global.save();
          }
        }
      }
      let blacklist = await blacklistDB.find({});
      if (blacklist.length > 0) {
        blacklist.forEach(async member => {
          if (member.endDate < Date.now()) {
            await blacklistDB.findOneAndDelete({ id: member.id });
            console.log('member unblacklisted');
          }
        })
      }
    });
    client.user.setPresence({ activity: {name: 'avoyage', type: 'PLAYING'}, status: 'idle'});
    
})

client.login(process.env.TOKEN);

function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}