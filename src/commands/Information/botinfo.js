const { SlashCommandBuilder } = require("@discordjs/builders")

const startDate = Date.now()

module.exports = {
    cooldown: {
        time: 3000,
        message: "You are on cooldown, please wait 3 seconds",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Bot Status & Info"),
    async execute(client, interaction) {
        const msg = await interaction.deferReply({fetchReply: true})

        client.basicEmbed({
            type: "editReply",
            title: "🤖・Bot Info",
            thumbnail: `${client.user.displayAvatarURL()}`,
            fields: [
                { name: "Bot Name", value: `${client.user.username}`, inline: true},
                { name: "Bot Id", value: `${client.user.id}`, inline: true},
                { name: "Created at", value: `<t:${Math.round(client.user.createdTimestamp / 1000)}:d>`, inline: true},
                { name: "Bot Owner", value: `<@!399301340326789120>`, inline: true},
                { name: "Bot Latency", value: `${msg.createdTimestamp - interaction.createdTimestamp}`, inline: true},
                { name: "Websocket Latency", value: `${client.ws.ping}`, inline: true},
                { name: "Bot Version", value: `${require(`${process.cwd()}/package.json`).version}`, inline: true}, 
                { name: "Discord.js Version", value: `${require("discord.js/package.json").version}`, inline: true}, 
                { name: "Node.js Version", value: `${process.version}`, inline: true}, 
                { name: "Started since", value: `<t:${Math.round(startDate / 1000)}:d>`, inline: true},
                { name: `Commands (${client.commands.size})`, value: `Dev Commands: **${client.commands.filter(cmd => cmd.devOnly === true).size}**\nUser Commands: **${client.commands.filter(cmd => cmd.devOnly !== true).size}**`, inline: true},
                { name: "Servers", value: `${client.guilds.cache.size}`, inline: true}
            ],
        }, interaction)
    }
}
