const Discord = require('discord.js');
module.exports = {
  name: 'eval',
  category: 'Utility',
  description: '**BOT OWNER ONLY** - Evaluate javascript code directly in discord.',
  cooldown: '3s',
  callback: async ({ message, args, client }) => {
    if (message.author.id !== '206982524021243914') return message.channel.send("This is a rev only command :eyes:");
    try {
      const code = args.join(' ');
      let evaled = await eval(code);

      if (typeof evaled !== 'string') {
        evaled = require("util").inspect(evaled);
      }
      message.channel.send(clean(evaled), {code: 'xl'});
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
}

const clean = text => {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}