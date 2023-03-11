const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    cooldown: {
        time: 7000,
        message: "You are on cooldown, please wait 7 seconds",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Display a User Avatar")
    .addUserOption((option) => option
        .setName("target")
        .setDescription("target")
        .setRequired(true)
    ),
    async execute(client, interaction) {
        const target = interaction.options.get('target') 

        client.basicEmbed({
            type: `reply`,
            title: `${target.user.tag}'s Avatar`,
            url: `${target.user.displayAvatarURL({size: 1024})}`,
            image: `${target.user.displayAvatarURL({size: 1024})}`,
        }, interaction)
    }
}
