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
        
        const { Account_Data, MMR_Data } = await valorant1.getUserData(user, tagline)

        var TotalWins = 0
        var TotalMatches = 0
        Object.entries(MMR_Data.data.by_season).map(([key, val]) => {
            if(val.wins != undefined){
                TotalWins += val.wins
            }
            if(val.number_of_games != undefined){
                TotalMatches += val.number_of_games
            }
        })

        Account = {
            Name: Account_Data.data.name,
            Tagline: Account_Data.data.tag,
            Level: Account_Data.data.account_level || "0",
            Card: Account_Data.data.card.wide || "https://media.valorant-api.com/playercards/b9e318c3-4590-d095-0218-ac92e1405459/wideart.png",
            LRR: MMR_Data.data.current_data.mmr_change_to_last_game || "0",
            Elo: MMR_Data.data.current_data.elo || "0",
            Matches: TotalMatches,
            Wins: TotalWins,
            Winrate: Math.floor(Math.round(TotalWins / TotalMatches * 100)) + "%",
            Peek: MMR_Data.data.highest_rank.patched_tier || "Unranked",
            PeekAct: MMR_Data.data.highest_rank.season || "",
            CurrentRank: MMR_Data.data.current_data.currenttierpatched || "Unranked",
            RankImage: MMR_Data.data.current_data.images.small.includes("null") ? "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/0/smallicon.png" : MMR_Data.data.current_data.images.small
        }

        client.basicEmbed({
            type: "editReply",
            thumbnail: `${Account.RankImage}`,
            image: `${Account.Card}`,
            author: {name: `Stats requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`},
            title: `Valorant Competitive Stats [${Account.Name + "#" + Account.Tagline}]`,
            fields: [
                {name: "Last Rank Rating", value: `${Account.LRR}`, inline: true},
                {name: "MMR (Elo)", value: `${Account.Elo}`, inline: true},
                {name: "\u200b", value: "\u200b", inline: true},
                {name: "Matches", value: `${Account.Matches}`, inline: true},
                {name: "Wins", value: `${Account.Wins}`, inline: true},
                {name: "Winrate", value: `${Account.Winrate}`, inline: true},
                {name: "Peek Rank", value: `${Account.Peek} ${Account.PeekAct ? `\nin ${Account.PeekAct[0].toUpperCase() + Account.PeekAct[1] + ":" + Account.PeekAct[2].toUpperCase() + Account.PeekAct[3]}` : ""}`, inline: true},
                {name: "Current Rank", value: `${Account.CurrentRank}`, inline: true},
                {name: "Account Level", value: `${Account.Level}`, inline: true}
            ],
        }, interaction)
    }
}
