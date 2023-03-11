const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionsBitField } = require("discord.js")

module.exports = {
    cooldown: {
        time: 3000,
        message: "You are on cooldown, please wait 3 seconds",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("remrole")
    .setDescription("Remove a Role from a User")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles)
    .addUserOption((option) => option
        .setName("target")
        .setDescription("target")
        .setRequired(true)
    )
    .addRoleOption((option) => option
        .setName("role")
        .setDescription("role")
        .setRequired(true)
    ),
    async execute(client, interaction) {
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)){
            return client.errEmbed({type: "reply", ephemeral: true, desc: "I dont have the required permissions to manage roles"}, interaction)
        }

        const target = interaction.options.get("target")
        const roleId = interaction.options.get("role").value

        const role = interaction.guild.roles.cache.find(role => role.id === roleId)
 
        if(target.member){
            if(!role || role.name == "@everyone"){
                client.errEmbed({
                    type: "reply",
                    ephemeral: true,
                    desc: `The role you trying to remove from <@!${target.user.id}>, is not valid.`
                }, interaction)      
            } else {
                await target.member.roles.remove(role.id).then(() => {return client.successEmbed({type: "reply", ephemeral: true, desc: `Removed <@&${role.id}> from <@!${target.user.id}>`}, interaction)}).catch(() => {return client.errEmbed({type: "reply", ephemeral: true, desc: "The role is either above me or i dont have the required permissions to remove the role"}, interaction)})
            }
        } else {
            client.errEmbed({
                type: "reply",
                ephemeral: true,
                desc: `The target (<@!${target.user.id}>) you trying to remove a role, is not on this server.`
            }, interaction)
        }
    }
}
