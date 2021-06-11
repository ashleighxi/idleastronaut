module.exports = {
  aliases: [],
  name: 'ping',
  category: 'Utility',
  description: 'Provides the current bot latency.',
  callback: ({ message, client }) => {
    message.channel.send('Loading data').then ( async (msg) => {
      msg.delete()
      message.channel.send(`🏓Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    });
  }
}