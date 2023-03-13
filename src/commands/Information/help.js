const { SlashCommandBuilder} = require("@discordjs/builders")
const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
    cooldown: {
        time: 5000,
        message: "You are on cooldown, please wait 5 seconds",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows Help"),
    async execute(client, interaction) {
        const folders = [
            ...new Set(client.commands.map(cmd => cmd.Folder))
        ]

        const modules = folders.map((folder) => {
            const getCommands = client.commands.filter(cmd => cmd.Folder === folder).map(cmd => {
                return{
                    name: cmd.data.name,
                    description: cmd.data.description
                }
            })

            return{
                folder: folder,
                commands: getCommands
            }
        })

        const emojis = {
            Fun: {
                emoji: "🎮", 
                url: "https://cdn.discordapp.com/emojis/1081204085530828800.png"
            },
            Information: {
                emoji: "🌎",
                url: "https://cdn.discordapp.com/emojis/1081204088127094805.png" 
            },
            NSFW: {
                emoji: "🔞",
                url: "https://cdn.discordapp.com/emojis/1081204083970543686.png"
            },
            VALORANT: {
                emoji: `<:valorant:1081207365161979976>`,
                url: "https://cdn.discordapp.com/emojis/1081207365161979976.png"
            },
            Moderation: {
                emoji: "🛡️",
                url: "https://cdn.discordapp.com/emojis/1081204080329891933.png"
            },
            Tools: {
                emoji: "⚒️",
                url: "https://cdn.discordapp.com/emojis/1081204081709830155.png"
            },
            Reactionrole: {
                emoji: `<:reactrole:1084934711178186862>`,
                url: "https://cdn.discordapp.com/emojis/1084934711178186862.png"
            }
        }

        const Components = (state) => [
            new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId(`help-select`)
					.setPlaceholder('Select a category')
                    .setDisabled(state)
                    .addOptions(
                    modules.map((module) => {
                        return{
                            label: module.folder,
                            value: module.folder,
                            description: `Commands from ${module.folder} module`,
                            emoji: emojis[module.folder].emoji
                        }
                    })
                )
			),
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Home")
                    .setCustomId("help-home")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(state),
                new ButtonBuilder()
                    .setLabel("Commands List")
                    .setCustomId("help-cmdlist")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(state)
            )
        ]

        const msg = await client.basicEmbed({
            type: "reply",
            components: Components(false),
            author: {name: "Mizore Help-Menu", iconURL: client.user.displayAvatarURL()},
            desc: "Please use the Select Menu below to get further information about a module.",
            fields: [
                {name: "📎 Links:", value: ">>> [Github](https://github.com/lxstarino)\n[Steam](https://steamcommunity.com/id/lxstarino/)"}
            ],
            footer: {text: "Note: Interactable disables after 20 seconds"}
        }, interaction)

        const col = msg.createMessageComponentCollector({filter: i => i.user.id === interaction.user.id, time: 20000})

        col.on("collect", async(i) => {
            switch(i.customId){
                case "help-select":
                    const [folder] = i.values
                    const module = modules.find(x => x.folder === folder)
        
                    client.basicEmbed({
                        type: "update",
                        title: `${module.folder}`,
                        thumbnail: `${emojis[module.folder].url}`,
                        fields: module.commands.map((cmd) => {
                            return{
                                name: `\`/${cmd.name}\``,
                                value: `• ${cmd.description}`
                            }
                        }),
                        footer: {text: "Note: Interactable disables after 20 seconds"}
                    }, i)
                    break
                case "help-cmdlist": 
                        const getModules = modules.map(module => {
                            const getCmds = module.commands.map(cmd => {
                                return cmd.name
                            })

                            return {
                                name: module.folder,
                                cmds: getCmds
                            }
                        })
                
                        client.basicEmbed({
                            type: "update",
                            title: `Commands List`,
                            fields: getModules.map(module => {
                                return{
                                    name: `${emojis[module.name].emoji} • ${module.name}`,
                                    value: `\`${module.cmds.join("\`, `")}\``
                                }
                            }),
                            footer: {text: "Note: Interactable disables after 20 seconds"}
                        }, i)
                        break
                case "help-home":
                    i.update({embeds: msg.embeds})
                    break
            }
        })

        col.on("ignore", async(i) => client.errEmbed({type: "reply", ephemeral: true, desc: "You cant use this menu"}, i))
        col.on("end", () => interaction.editReply({components: Components(true)}))
    }
}
