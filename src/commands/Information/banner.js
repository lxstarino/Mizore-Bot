const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    cooldown: {
        time: 7000,
        message: "You are on cooldown, please wait 7 seconds",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("banner")
    .setDescription("Displays a User Banner")
    .addUserOption((option) => option
        .setName("target")
        .setDescription("target")
        .setRequired(true)
    ),
    async execute(client, interaction){
        const target = interaction.options.get("target")

        await fetch(`https://discord.com/api/v8/users/${target.user.id}`, {
            headers: { Authorization: `Bot ${client.token}` }
        }).then(async res => {
            const {banner, accent_color} = await res.json()

            if(banner){
                const format = banner.startsWith("a_") ? ".gif" : ".png"

                client.basicEmbed({
                    type: "reply",
                    title: `${target.user.tag}'s banner`,
                    image: `https://cdn.discordapp.com/banners/${target.user.id}/${banner}${format}?size=1024`,
                    color: accent_color
                }, interaction)
            } else if(accent_color) {
                client.basicEmbed({
                    type: "reply",
                    desc: `${target.user.tag} doesn't have a banner but a accent color`,
                    color: accent_color
                }, interaction) 
            } else {
                client.errEmbed({type: "reply", ephemeral: true, desc: `${target.user.tag} doesn't have a banner and a accent color`}, interaction)
            }
        }).catch(() => {
            throw "Failed to fetch response"
        })
    }
}