const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    cooldown: {
        time: 7000,
        message: "You are on cooldown, please wait 7 seconds",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Displays Information about the current Server"),
    async execute(client, interaction){
        const guild_invites = await interaction.guild.invites.fetch()
        const description = interaction.guild.description

        const BoostLevel = {
            "0": `${interaction.guild.premiumSubscriptionCount}/2`,
            "1": `${interaction.guild.premiumSubscriptionCount}/7`,
            "2": `${interaction.guild.premiumSubscriptionCount}/14`,
        }

        client.basicEmbed({
            type: "reply",
            thumbnail: `${interaction.guild.iconURL() || interaction.user.defaultAvatarURL}`,
            fields: [
                { name: `${interaction.guild.name}`, value: `${description ? description : "No description provided"}`, inline: false},
                { name: "Server Owner", value: `<@!${interaction.guild.ownerId}>`, inline: true},
                { name: `Server Level (${interaction.guild.premiumTier})`, value: `Boosts: ${BoostLevel[interaction.guild.premiumTier]}`, inline: true},  
                { name: "Created on", value: `🗓️ <t:${Math.round(interaction.guild.createdTimestamp / 1000)}:d>`, inline: true},    
                { name: "Member Count", value: `**${interaction.guild.memberCount}** member(s)`, inline: true}, 
                { name: "Invite Codes", value: `**${guild_invites.size}** code(s)`, inline: true},  
                { name: "\u200b", value: `\u200b`, inline: true},  
                { name: "Role/Emoji/Sticker Count", value: `**${interaction.guild.roles.cache.size}** role(s) | **${interaction.guild.emojis.cache.size}** emoji(s) | **${interaction.guild.stickers.cache.size}** sticker(s)`, inline: false},
                { name: `Channels (${interaction.guild.channels.cache.size})`, value: `Categories: **${interaction.guild.channels.cache.filter(c => c.type === 4).size}** | Text Channels: **${interaction.guild.channels.cache.filter(c => c.type === 0).size}** | VC Channels: **${interaction.guild.channels.cache.filter(c => c.type === 2).size}**`, inline: false},
            ],
            timestamp: interaction.createdTimestamp,
            footer: {text: `Server ID: ${interaction.guild.id}`}
        }, interaction)
    }
}
