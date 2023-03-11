const { SlashCommandBuilder } = require("@discordjs/builders")
const valorant = require("../../api/valorant")
const valorant1 = new valorant()

module.exports = {
    cooldown: {
        time: 10000,
        message: "You are on cooldown, please wait 10 seconds",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("vl-stats")
    .setDescription("Sends stats of a valorant user")
    .addStringOption((option) => option
        .setName("username")
        .setDescription("Players username")
        .setMaxLength(16)
        .setMinLength(3)
        .setRequired(true)
    ).addStringOption((option) => option
        .setName("tag")
        .setDescription("Players tagline")
        .setMaxLength(5)
        .setMinLength(3)
        .setRequired(true)
    ),
    async execute(client, interaction){
        const user = interaction.options.get("username").value
        const tagline = interaction.options.get("tag").value

        await interaction.deferReply()
        
        const userData = await valorant1.getUserData(user, tagline)

        const Wins = []
        const Games = []
        Object.entries(userData.MMR_Data.data.by_season).map( ([key, val] = entry) => {
            if(val.wins != undefined){
                Wins.push(val.wins)
            }
            if(val.number_of_games != undefined){
                Games.push(val.number_of_games)
            }
        })

        var totalWins = 0
        Wins.forEach(win => {
            totalWins += win
        })
        var totalGames = 0
        Games.forEach(game => {
            totalGames += game
        })

        client.basicEmbed({
            type: "editReply",
            title: `Valorant Alltime Stats [${userData.Account_Data.data.name + "#" + userData.Account_Data.data.tag}]`,
            author: {name: `Stats requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL() || interaction.user.defaultAvatarURL}`},
            thumbnail: `${userData.MMR_Data.data.current_data.images.small}`,
            fields: [
                { name: "Last Rank Rating", value: `${userData.MMR_Data.data.current_data.mmr_change_to_last_game}`, inline: true},
                { name: "MMR (Elo)", value: `${userData.MMR_Data.data.current_data.elo}`, inline: true},
                { name: "\u200b", value: "\u200b",inline: true},
                { name: "Matches", value: `${totalGames}`, inline: true},
                { name: "Wins", value: `${totalWins}`, inline: true},
                { name: "Winrate", value: `${Math.floor(Math.round(totalWins / totalGames * 100))}%`, inline: true},
                { name: "Peek Rank", value: `${userData.MMR_Data.data.highest_rank.patched_tier}\nin ${userData.MMR_Data.data.highest_rank.season[0].toUpperCase() + userData.MMR_Data.data.highest_rank.season[1] + ":" + userData.MMR_Data.data.highest_rank.season[2].toUpperCase() + userData.MMR_Data.data.highest_rank.season[3]}`, inline: true},
                { name: "Current Rank", value: `${userData.MMR_Data.data.current_data.currenttierpatched}`, inline: true},
                { name: "Account Level", value: `${userData.Account_Data.data.account_level}`, inline: true}                
            ],
            image: `${userData.Account_Data.data.card.wide}`      
        }, interaction)
    }
}