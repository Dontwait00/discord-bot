const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if (!message.guild) return;
 
//=================================================================== kick
  if (message.content.startsWith('?kick')) {
    if(!message.member.roles.some(r=>["OWNERS", "Admin"].includes(r.name)) )
    return message.reply("what are you trying to do? :thonk: Only Moderators can use this command");
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        member.kick('Optional reason that will display in the audit logs').then(() => {
          message.reply(`Successfully kicked ${user.tag}`);
        }).catch(err => {
          message.reply('I was unable to kick the member');
          console.error(err);
        });
      } else {
        message.reply('That user isn\'t in this guild!');
      }
    } else {
      message.reply('You didn\'t mention the user to kick!');
    }
  }
//=================================================================== ban
    if (message.content.startsWith('?ban')) {
      if(!message.member.roles.some(r=>["OWNERS"].includes(r.name)) )
      return message.reply("what are you trying to do? :thonk:");
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        member.ban({
          reason: 'They were bad!',
        }).then(() => {
          message.reply(`Successfully banned ${user.tag}`);
        }).catch(err => {
          message.reply('i was unable to ban the member');
          console.error(err);
        });
      } else {
        message.reply('that user isn\'t in this guild!');
      }
    } else {
      message.reply('you didn\'t mention the user to ban!');
    }
  }
//===================================================================== new member
 });
client.login(process.env.BOT_TOKEN);
