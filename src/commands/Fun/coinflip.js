const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    cooldown: {
        time: 3000,
        message: "You are on cooldown, please wait 3 seconds",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Flip a coin")
    .addStringOption((option) => option
        .setName('coinside')
        .setDescription("Coin Side")
        .setRequired(true)
        .addChoices(
            {name: "Tail", value: "Tail"},
            {name: "Head", value: "Head"}
        )
    ),
    async execute(client, interaction) {
        const coinside = interaction.options.get('coinside').value
        const coin_side = ["Head", "Tail"]

        const result = coin_side[Math.floor(Math.random() * coin_side.length)]

        client.basicEmbed({
            type: "reply",
            title: `🪙・Coinflip (${coinside})`,
            desc: `**Coin Side**: ${result}`,
            fields: coinside == result ? {name: "Result", value: "You Won"} : {name: "Result", value: "You Lost"} 
        }, interaction)
    }
}
