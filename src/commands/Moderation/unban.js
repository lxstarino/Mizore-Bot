const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionsBitField } = require("discord.js")

module.exports = {
    cooldown: {
        time: 3000,
        message: "You are on cooldown, please wait 3 seconds",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a User")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
    .addUserOption((option) => option
        .setName("target")
        .setDescription("target")
        .setRequired(true)
    ),
    async execute(client, interaction) {
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)){
            return client.errEmbed({type: "reply", ephemeral: true, desc: "I dont have the required permissions to unban"}, interaction)
        }

        const target = interaction.options.get("target")

        const banList = await interaction.guild.bans.fetch()
        if(banList.get(target.user.id)){
            await interaction.guild.members.unban(target.user.id).then(() => {client.successEmbed({type: "reply", desc: `<@!${interaction.user.id}> unbanned <@!${target.user.id}>.`}, interaction)}).catch(err => console.log(err))
        } else {
            client.errEmbed({type: "reply", ephemeral: true, desc: `The action for <@!${target.user.id}> can't be processed because this user is not banned`}, interaction)
        }
    }
}
