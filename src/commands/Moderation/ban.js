const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
    cooldown: {
        time: 3000,
        message: "You are on cooldown, please wait 3 seconds",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a User")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
    .addUserOption((option) => option
        .setName("target")
        .setDescription("target")
        .setRequired(true)
    ),
    async execute(client, interaction) {
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)){
            return client.errEmbed({type: "reply", ephemeral: true, desc: "I dont have the required permissions to ban"}, interaction)
        }

        const target = interaction.options.get("target")
    
        if(target.member){
            if(target.member.moderatable){
                createBanMenu(client, interaction, target)
            } else {
                client.errEmbed({type: "reply", ephemeral: true, desc: `The action for <@!${target.user.id}> can't be processed because the bot is lacking permissions`}, interaction)
            }
        } else {
            const banList = await interaction.guild.bans.fetch()
            if(!banList.get(target.user.id)){
                createBanMenu(client, interaction, target)
            } else {
                client.errEmbed({type: "reply", ephemeral: true, desc: `The action for <@!${target.user.id}> can't be processed because this user is already banned`}, interaction)
            }
        }
    }
}

async function createBanMenu(client, interaction, target){
    const buttons = (state) => new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId(`ban-confirm`)
            .setLabel("Confirm")
            .setStyle(ButtonStyle.Success)
            .setDisabled(state),
        new ButtonBuilder()
            .setCustomId(`ban-cancel`)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(state)                  
    )

    const msg = await client.basicEmbed({
        type: "reply",
        components: [buttons(false)],
        title: "Ban Menu",
        desc: `Are you sure you want to ban <@!${target.user.id}>`,
        timestamp: interaction.createdTimestamp,
        footer: {text: `Moderator: ${interaction.user.tag}`}
    }, interaction)

    const col = msg.createMessageComponentCollector({filter: i => i.user.id === interaction.user.id, time: 15000})

    col.on("collect", async(i) => {
        switch(i.customId){
            case "ban-confirm":
                await interaction.guild.members.ban(target.user.id).then(() => {
                    client.basicEmbed({
                        type: "update",
                        components: [buttons(true)],
                        title: "Ban Confirmed",
                        desc: `<@!${target.user.id}> was banned`,
                        timestamp: interaction.createdTimestamp,
                        footer: {text: `Moderator: ${interaction.user.tag}`}
                    }, i)
                }).catch(err => console.log(err))
                break
            case "ban-cancel":
                client.basicEmbed({
                    type: "update",
                    components: [buttons(true)],
                    title: "Ban Cancelled",
                    desc: `The process has been cancelled`,
                    timestamp: interaction.createdTimestamp,
                    footer: {text: `Moderator: ${interaction.user.tag}`}
                }, i)
                break
        }
    })

    col.on("ignore", async(i) => client.errEmbed({type: "reply", ephemeral: true, desc: "You cant use this menu"}, i))
    col.on("end", () => interaction.editReply({components: [buttons(true)]}))
}
