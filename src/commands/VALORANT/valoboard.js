const { SlashCommandBuilder } = require("@discordjs/builders")
const { ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle } = require("discord.js")
const valorant = require("../../api/valorant")
const valorant1 = new valorant()

module.exports = {
    cooldown: {
        time: 15000,
        message: "You are on cooldown, please wait 15 seconds!",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("vl-leaderboard")
    .setDescription("Valorant leaderboard statistics")
    .addStringOption((option) => option
        .setName("region")
        .setDescription("Region leaderboard")
        .setRequired(true)
        .addChoices(
            {name: "North America/Latin America/Brazil", value: "na"},
            {name: "Europe", value: "eu"},
            {name: "Korea", value: "kr"},
            {name: "Asia Pacific", value: "ap"}
    )),
    async execute(client, interaction) {
        const region = interaction.options.get("region").value

        await interaction.deferReply()
        const lb_data = await valorant1.getLeaderBoardData(region)

        const Buttons = (btnState_1, btnState_2) => new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("back+")
                    .setLabel("<<")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(btnState_1), 
                new ButtonBuilder()
                    .setCustomId("back")
                    .setLabel("<")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(btnState_1), 
                new ButtonBuilder()
                    .setCustomId("next")
                    .setLabel(">")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(btnState_2),    
                new ButtonBuilder()
                    .setCustomId("next+")
                    .setLabel(">>")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(btnState_2),      
            )

        var min = 0;
        var max = 10;  

        const data = lb_data.map(player => {
            return{
                name: `#${player.leaderboardRank} - ${player.IsAnonymized ? "Secret Agent" : player.gameName + "#" + player.tagLine}`,
                value: `\`Total Wins: ${player.numberOfWins} | ${player.rankedRating}RR\``
            }
        })
  
        const vl_lb = await client.basicEmbed({
            type: "editReply",
            components: [Buttons(true, false)],
            author: {name: `Leaderboard requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL() || interaction.user.defaultAvatarURL}`},
            title: `Valorant Leaderboard (${region.toUpperCase()})`,
            desc: "`Note: Interactable disables after 45 seconds`",
            fields: data.slice(min, max)
        }, interaction)  
        
        const col = vl_lb.createMessageComponentCollector({filter: i => i.user.id === interaction.user.id, componentType: ComponentType.Button, time: 45000})

        col.on("collect", async(i) => {
            switch(i.customId){
                case "next":
                    min += 10
                    max += 10
                    break
                case "next+":
                    min += 50
                    max += 50
                    break
                case "back":
                    min -= 10
                    max -= 10
                    break
                case "back+":
                    min -= 50
                    max -= 50
                    break
            }

            client.basicEmbed({
                type: "update",
                components: [Buttons(min < 10 ? true : false, max > lb_data.length - 1 ? true : false)],
                author: {name: `Leaderboard requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL() || interaction.user.defaultAvatarURL}`},
                title: `Valorant Leaderboard (${region.toUpperCase()})`,
                desc: "`Note: Interactable disables after 45 seconds`",
                fields: data.slice(min < 0 ? min = 0 : min && min > lb_data.length - 10 ? min = lb_data.length - 10 : min, max < 10 ? max = 10 : max && max > lb_data.length ? max = lb_data.length : max)
            }, i) 
        })

        col.on("end", async() => interaction.editReply({components: [Buttons(true, true)]}))
        col.on("ignore", async(i) => client.errEmbed({type: "reply", ephemeral: true, desc: `You cant use this menu.`}, i))
    }
}