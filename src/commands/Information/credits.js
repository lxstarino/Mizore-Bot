const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    cooldown: {
        time: 3000,
        message: "You are on cooldown, please wait 3 seconds",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("credits")
    .setDescription("Displays the credits"),
    async execute(client, interaction){
        client.basicEmbed({
            type: "reply",
            title: "🤖・Credits",
            desc: "Bot coded by <@!399301340326789120>",
            fields: [
                {name: "Thanks to", value: "<@!278623185216471040> (Translation & Ideas of Concept)\n<@!752101696418873344> (Motivational Speech)"},
                {name: "Source Code", value: "https://github.com/lxstarino/Mizore-Bot"},
                {name: "API's", value: "[RealBooru API (NSFW)](https://realbooru.com/index.php?page=help&topic=dapi)\n[Rule34 API (NSFW)](https://api.rule34.xxx/)\n[Valorant API](https://docs.henrikdev.xyz/valorant.html)", inline: true},
                {name: "NPM Packages", value: "`discord.js@14.7.1`\n`dotenv`\n`fs`", inline: true}
            ]
        }, interaction)
    }
}
