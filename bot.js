const Discord = require('discord.js');
const client = new Discord.Client();
const cheerio = require('cheerio'),
      snekfetch = require('snekfetch'),
      querystring = require('querystring');

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if (!message.guild) return;
      
      const prefix = '?';
      
      let sender = message.author; // This variable takes the message, and finds who the author is.
    let cont = message.content.slice(prefix.length).split(" "); // This variable slices off the prefix, then puts the rest in an array based off the spaces
    let args = cont.slice(1); // This slices off the command in cont, only leaving the arguments.

//=================================================================== kick
  if (message.content.startsWith(prefix + 'kick')) {
    if(!message.member.roles.some(r=>["OWNERS", "Admin", "Mod", "Creator", "Moderators", "Global Moderator", "NX++"].includes(r.name)) )
    return message.reply("You need the \`moderators role\` to use this command.");
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        member.kick('Optional reason that will display in the audit logs').then(() => {
          message.reply(`successfully kicked ${user.tag}`);
        }).catch(err => {
          message.reply('i was unable to kick the member');
          console.error(err);
        });
      } else {
        message.reply('that user isn\'t in this guild!');
      }
    } else {
      message.reply('you didn\'t mention the user to kick!');
    }
  }
//=================================================================== ban
    if (message.content.startsWith(prefix + 'ban')) {
      if(!message.member.roles.some(r=>["OWNERS", "Admin", "Mod", "Creator", "Global Moderators", "NX++"].includes(r.name)) )
      return message.reply("You need the \`moderators role\` to use this command.");
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        member.ban({
          reason: 'They were bad!',
        }).then(() => {
          message.reply(`successfully banned ${user.tag}`);
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
//===================================================================== help
      
    if (message.content === prefix + 'server') {
       message.channel.send(`\nGETTING SERVER INFORMATION:\n\nName: ${message.guild.name}\nServer ID: ${message.guild.id}\nMembers: ${message.guild.memberCount}\nServer build: ${message.guild.createdAt}\nServer Creator: ${message.guild.owner}\nOwner ID: ${message.guild.ownerID}\nRegion: ${message.guild.region}\nVerification level: ${message.guild.verificationLevel}\nServer verified: ${message.guild.verified}`);
       }
    else if (message.content === prefix + 'user') {
    message.channel.send(`**Your username:** \`${message.author.username}\`\n**Your ID:** \`${message.author.id}\`\n**Created on:** \`${message.author.createdAt}\`\n**Discord tag:** \`${message.author.tag}\`\n`);
       }
    if (message.content === prefix + 'ping') {
       message.channel.send(`:ping_pong: motherfucker! Latency is **${Math.round(client.ping)}ms**`);
       }
  if (message.content === prefix + 'help') {
    // We can create embeds using the MessageEmbed constructor
    // Read more about all that you can do with the constructor
    // over at https://discord.js.org/#/docs/main/stable/class/RichEmbed
    const embed = new Discord.RichEmbed()
      // Set the title of the field
      .setTitle('Help')
      // Set the color of the embed
      .setColor(0xFF0000)
      // Set the main content of the embed
      .setDescription (`List of all commands ready to be used. Be sure to use the prefix \`?\` before running a command.\n**Commands**\nfor more details, write ex. \`?kick\`\n\`kick\`, \`ban\`, \`ping\`, \`server\`, \`user\`, \`clean\``) ;
    // Send the embed to the same channel as the message
    message.channel.send(embed);
  }
  
      if (message.content === prefix + 'member++') {
            var role = message.guild.roles.find('name', 'member++');
            message.member.addRole(role.id);
            message.channel.send("Successfully added!");
      }
      
if (message.content.startsWith(prefix + 'google')) {
// Depending on your command framework (or if you use one), it doesn't have to
// edit messages so you can rework it to fit your needs. Again, this doesn't have
// to be async if you don't care about message editing.
async function googleCommand(msg, args) {

   // These are our two variables. One of them creates a message while we preform a search,
   // the other generates a URL for our crawler.
   let searchMessage = await message.reply('Searching... Sec.');
   let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(msg.content)}`;

   // We will now use snekfetch to crawl Google.com. Snekfetch uses promises so we will
   // utilize that for our try/catch block.
   return snekfetch.get(searchUrl).then((result) => {

      // Cheerio lets us parse the HTML on our google result to grab the URL.
      let $ = cheerio.load(result.text);

      // This is allowing us to grab the URL from within the instance of the page (HTML)
      let googleData = $('.r').first().find('a').first().attr('href');

      // Now that we have our data from Google, we can send it to the channel.
      googleData = querystring.parse(googleData.replace('/url?', ''));
      searchMessage.edit(`Result found!\n${googleData.q}`);

  // If no results are found, we catch it and return 'No results are found!'
  }).catch((err) => {
     searchMessage.edit('No results found!');
     });
   }
 }
         if (message.content.startsWith(prefix + 'clean')) { // This time we have to use startsWith, since we will be adding a number to the end of the command.
        // We have to wrap this in an async since awaits only work in them.
        async function purge() {
             // Let's delete the command message, so it doesn't interfere with the messages we are going to delete.
              if(!message.member.roles.some(r=>["OWNERS", "Admin", "Mod", "Creator", "Moderators", "Global Moderators", "NX++"].includes(r.name)) )
    return message.reply("You need the \`moderators role\` to use this command.");
            // We want to check if the argument is a number
            if (isNaN(args[0])) {
                // Sends a message to the channel.
                message.channel.send('Please use a number as your arguments. \n Usage: \`' + prefix + 'clean <amount>\`'); //\n means new line.
                // Cancels out of the script, so the rest doesn't run.
                return;
            }

            const fetched = await message.channel.fetchMessages({limit: args[0]}); // This grabs the last number(args) of messages in the channel.
            console.log(fetched.size + ' messages found, deleting...'); // Lets post into console how many messages we are deleting

            // Deleting the messages
            message.channel.bulkDelete(fetched)
              return message.reply(`successfully deleted ${args[0]} messages`);
                
        }

        // We want to make sure we call the function whenever the purge command is run.
        purge(); // Make sure this is inside the if(msg.startsWith)

    }
      
 });
('message', message => {
   if (message.content === prefix + 'reset') {
    message.reply('Resetting...');
    then(msg => client.destroy())
    then(() => client.login(BOT_TOKEN));
   }
});
client.login(process.env.BOT_TOKEN);
