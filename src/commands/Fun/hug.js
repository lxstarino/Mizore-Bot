const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    cooldown: {
        time: 3000,
        message: "You are on cooldown, please wait 3 seconds!",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("hug")
    .setDescription("Hug Someone")
    .addUserOption((option) => option
        .setName("target")
        .setDescription("target")
        .setRequired(true)
    ),
    async execute(client, interaction) {
        const target = interaction.options.get("target")

        if(target.member){
            const img = await fetch(`https://api.nekos.dev/api/v3/images/sfw/gif/hug/`)
            .then(response => response.json())
            .catch(() => {
                throw "Failed to fetch response"
            })

            client.basicEmbed({
                type: "reply",
                desc: `<@!${interaction.user.id}> hugs <@!${target.user.id}>`,
                image: `${img.data.response.url}`
            }, interaction)
        } else {
            client.errEmbed({
                type: "reply",
                ephemeral: true,
                desc: "User not found"
            }, interaction)
        }
    }
}