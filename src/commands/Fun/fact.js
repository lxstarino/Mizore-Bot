const { SlashCommandBuilder, codeBlock } = require("@discordjs/builders")

module.exports = {
    cooldown: {
        time: 3000,
        message: "You are on cooldown, please wait 3 seconds!",
        users: new Set()
    },
    data: new SlashCommandBuilder()
        .setName("fact")
        .setDescription("Request a useless fact"),
    async execute(client, interaction) {
        const fact = await fetch("https://uselessfacts.jsph.pl/random.json?language=en")
        .then(response => response.json())
        .catch(() => {
            throw "Failed to fetch response"
        })

        client.basicEmbed({
            type: "reply",
            desc: `${codeBlock(fact.text)}`
        }, interaction)
    }
}
