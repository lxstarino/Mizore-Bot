const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    cooldown: {
        time: 3000,
        message: "You are on cooldown, please wait 3 seconds",
        users: new Set()
    },
    data: new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Roll a Dice"),
    async execute(client, interaction) {
        client.basicEmbed({
            type: "reply",
            title: "🎲 Roll Dice",
            desc: `${interaction.user.tag} threw a ${Math.floor(Math.random() * 6) + 1}`
        }, interaction)
    }
}