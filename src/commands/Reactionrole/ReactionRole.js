const { SlashCommandBuilder } = require("@discordjs/builders")
const { ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField } = require("discord.js")

module.exports = {
    cooldown: {
        time: 15000,
        message: "You are on cooldown, please wait 15 seconds",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("self-role")
    .setDescription("Creates a Selection Role Menu")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addStringOption((option) => option
        .setName("title")
        .setDescription("The title for the menu")
        .setRequired(true)
    ).addStringOption((option) => option
        .setName("description")
        .setDescription("The description for the menu")
        .setRequired(true)
    ),
    async execute(client, interaction){
        let title = interaction.options.get("title").value
        let desc = interaction.options.get("description").value
        let roles = []

        await client.basicEmbed({
            type: "reply",
            title: "Self-Role Menu",
            color: "#2b2d31",
            desc: "Mention a role you want to add to your self-role menu | Type `send` when your done",
            footer: {text: "You can cancel the process by entering `cancel`"}
        }, interaction)

        const col = interaction.channel.createMessageCollector({filter: m => m.author.id === interaction.user.id, time: 60000})

        col.on("collect", (m) => {
            if(m.content == "cancel"){
                client.successEmbed({type: "editReply", desc: "The Process has been canceled"}, interaction)
                col.stop()
            } else {
                if(m.content == "send"){
                    if(!roles.length > 0) return client.errEmbed({type: "followUp", ephemeral: true, desc: "There are no roles in this menu"}, interaction)          
                    interaction.channel.bulkDelete(col.collected)

                    const RoleMenu = new ActionRowBuilder().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("reactionrole-select")
                            .setPlaceholder("select a role")
                            .addOptions(roles.map(role => {
                                return{
                                    label: role.name,
                                    value: role.id,
                                    description: role.id
                                }
                            }))
                    )

                    client.successEmbed({
                        type: "editReply",
                        desc: `Self-Role Menu was sucessfully created in <#${interaction.channel.id}>`
                    },interaction)

                    client.basicEmbed({
                        components: [RoleMenu],
                        color: "#2b2d31",
                        title: `${title}`,
                        desc: `${desc}`
                    }, interaction.channel)

                    col.stop()          
                } else {
                    if(roles.length > 4) return client.errEmbed({type: "followUp", ephemeral: true, desc: "Only up to 5 Roles in a Menu are allowed"}, interaction)
                    const roleMention = m.content.substring(m.content.indexOf("<@&") + 3, m.content.indexOf(">"))
        
                    const role = interaction.guild.roles.cache.find(role => role.id === roleMention)
                    if(role){
                        if(role.position > interaction.guild.members.resolve(client.user).roles.highest.position){
                            client.errEmbed({type: "followUp", ephemeral: true, desc: "The role you tried to add is above me"}, interaction)
                        }
                        else {
                            if(!roles.find(roles => roles.id === role.id)){
                                interaction.channel.bulkDelete(col.collected)
                                col.collected.delete(col.collected)
    
                                roles.push({
                                    name: role.name,
                                    id: role.id
                                })
                                client.basicEmbed({
                                    type: "editReply",
                                    title: "Self-Role Menu", 
                                    color: "#2b2d31",
                                    desc: `Mention a role you want to add to your self-role menu | Type \`send\` when your done\n\n**Roles in Menu**:\n${roles.map(role => "<@&" + role.id + ">")}`,
                                    footer: {text: "You can cancel the process by entering `cancel`"}
                                }, interaction)
                            } else {
                                client.errEmbed({type: "followUp", ephemeral: true, desc: "The role is already in this menu"}, interaction)
                            }
                        }
                    } else {
                        client.errEmbed({type: "followUp", ephemeral: true, desc: "Thats not a valid role. Mention a valid role"}, interaction)
                    }
                }
            }
        })
    }
}
