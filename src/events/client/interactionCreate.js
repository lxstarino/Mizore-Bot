const developers = [
    "399301340326789120"
]

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if(interaction.isCommand()){
            const command = client.commands.get(interaction.commandName)
            
            if(!command) return
            if(!interaction.guild) return client.errEmbed({type: "reply", ephemeral: true, desc: `Bot commands are only available in servers`}, interaction)
            if(command.devOnly && !developers.includes(interaction.user.id)) return client.errEmbed({type: "reply", ephemeral: true, desc: `The /${command.data.name} command is only available for developers`}, interaction)
            if(command.nsfw && !interaction.channel.nsfw) return client.errEmbed({type: "reply", ephemeral: true, desc: `The /${command.data.name} command is only available in NSFW-Channel's`}, interaction)
            if(command.cooldown){
                if(command.cooldown.users.has(interaction.user.id)) return client.errEmbed({type: "reply", ephemeral: true, desc: `${command.cooldown.message}`}, interaction) 
                command.cooldown.users.add(interaction.user.id)
                setTimeout(() => {
                    command.cooldown.users.delete(interaction.user.id)
                }, command.cooldown.time)
            }

            try{
                await command.execute(client, interaction)
            } catch(err){
                console.error(err)
    
                if(interaction.deferred || interaction.replied) {
                    client.errEmbed({
                        type: "editReply",
                        desc: `${err}`
                    }, interaction)
                } else {
                    client.errEmbed({
                        type: "reply",
                        desc: `${err}`
                    }, interaction)
                }
            }
        }

        if(interaction.isStringSelectMenu()){
            if(interaction.customId == "reactionrole-select"){
                const [roleId] = interaction.values
                
                const role = interaction.guild.roles.cache.find(role => role.id === roleId)
                if(role){
                    await interaction.member.roles.add(role.id).then(() => {return client.successEmbed({type: "reply", ephemeral: true, desc: `Added <@&${role.id}> to <@!${interaction.user.id}>`}, interaction)}).catch(() => {return client.errEmbed({type: "reply", ephemeral: true, desc: "The role is either above me or i dont have the required permissions to give the role"}, interaction)})
                } else {
                    client.errEmbed({type: "reply", ephemeral: true, desc: "Role doesn't exist"}, interaction)
                }
            }
        }
    }
}
