const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    cooldown: {
        time: 5000,
        message: "You are on cooldown, please wait 5 seconds",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Conduct a Poll")
    .addStringOption((option) => option
        .setName("question")
        .setDescription("question")
        .setRequired(true)
        .setMaxLength(1028)
    ).addChannelOption((option) => option
        .setName("channel")
        .setDescription("channel")
    ),
    async execute(client, interaction){
        const channel = interaction.options.get("channel")
        const question = interaction.options.get("question").value

        if(channel != null){
            if(channel.channel.type == 0){
                const msg = await client.basicEmbed({
                    title: "Poll",
                    desc: `${question}`,
                    footer: {iconURL: `${interaction.user.displayAvatarURL()}`,text: `Created by ${interaction.user.username}`}
                }, channel.channel)
                
                msg.react("✅")
                msg.react("❌")

                client.successEmbed({
                    type: "reply",
                    ephemeral: true,
                    desc: `Poll was created in <#${channel.channel.id}>`
                }, interaction)
            } else {
                client.errEmbed({
                    type: "reply",
                    ephemeral: true,
                    desc: "Invalid Channel - Provide a Text Channel"
                }, interaction)
            }
        } else {
            const msg = await client.basicEmbed({
                type: "reply",
                title: "Poll",
                desc: `${question}`,
                footer: {iconURL: `${interaction.user.displayAvatarURL()}`,text: `Created by ${interaction.user.username}`}
            }, interaction)
    
            msg.react("✅")
            msg.react("❌")
        }
    }
}
