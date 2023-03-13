const { SlashCommandBuilder } = require("@discordjs/builders")
const { ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require("discord.js")

const valorant = require("../../api/valorant")
const valorant1 = new valorant()

const agent_emojis = {
    "Killjoy": "<:AgentKilljoy:912397893271425035>",
    "Cypher": "<:AgentCypher:912397855694684160>",
    "Neon": "<:AgentNeon:937901572795539517>",
    "Harbor": "<:AgentHarbor:1031995986203123812>",
    "Reyna": "<:AgentReyna:912397933931028550>",
    "Breach": "<:AgentBreach:912397803471396895>",
    "Astra": "<:AgentAstra:912397794441044008>",
    "Jett": "<:AgentJett:912397865635160155>",
    "Viper": "<:AgentViper:912398144195682384>",
    "Sova": "<:AgentSova:912397966298468372>",
    "Fade": "<:AgentFade:968955639441293374>",
    "Brimstone": "<:AgentBrimstone:912397815009931314>",
    "Omen": "<:AgentOmen:912397904830935050>",
    "Raze": "<:AgentRaze:912397923571073045>",
    "Sage": "<:AgentSage:912397943464661002>",
    "Skye": "<:AgentSkye:912397953593905174>",
    "Yoru": "<:AgentYoru:912398154631090186>",
    "Phoenix": "<:AgentPhoenix:912397913618006106>",
    "KAY/O": "<:AgentKAYO:912397875525337138>",
    "Chamber": "<:AgentChamber:912397841887010927>",
    "Gekko": "<:AgentGekko:1082765705461649428>"
}

module.exports = {
    cooldown: {
        time: 15000,
        message: "You are on cooldown, please wait 15 seconds",
        users: new Set()
    },
    data: new SlashCommandBuilder()
        .setName("vl-matches")
        .setDescription("Displays the last 5 matches of a player")
        .addStringOption((option) => option
            .setName("username")
            .setDescription("Players username")
            .setMaxLength(16)
            .setMinLength(3)
            .setRequired(true)
        ).addStringOption((option) => option
            .setName("tagline")
            .setDescription("Players tagline")
            .setMaxLength(5)
            .setMinLength(3)
            .setRequired(true)
        ).addStringOption((option) => option
            .setName("region")
            .setDescription("Players region")
            .setRequired(true)
            .addChoices(
                {name: "North America/Latin America/Brazil", value: "na"},
                {name: "Europe", value: "eu"},
                {name: "Korea", value: "kr"},
                {name: "Asia Pacific", value: "ap"}
        )).addStringOption((option) => option
        .setName("matchtype")
        .setDescription("Type of Match")
        .setRequired(true)
        .addChoices(
            {name: "Competetive", value: "competitive"},
            {name: "Unrated", value: "unrated"},
            {name: "Swiftplay", value: "swiftplay"},
            {name: "Spike Rush", value: "spikerush"}
        )),
        async execute(client, interaction)
        {
            const user = interaction.options.get("username").value
            const tagline = interaction.options.get("tagline").value
            const region = interaction.options.get("region").value
            const matchType = interaction.options.get("matchtype").value

            await interaction.deferReply()
            const { data } = await valorant1.getMatchData(region, user, tagline, matchType) 
            const p = data[0].players.red.find(data => data.name.toLowerCase() === user.toLowerCase() && data.tag.toLowerCase() === tagline.toLowerCase()) || data[0].players.blue.find(data => data.name.toLowerCase() === user.toLowerCase() && data.tag.toLowerCase() === tagline.toLowerCase())

            const match_select = (state) => [
                new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`match_select`)
                        .setPlaceholder("Select a Recent Match")
                        .setDisabled(state)
                        .addOptions(data.map(data => {
                            return {
                                label: `${data.metadata.map} - ${data.metadata.mode}`,
                                value: `${data.metadata.matchid}`,
                                description: `Played at ${data.metadata.game_start_patched}`
                            }
                        }))
                )
            ]

            const msg = await client.basicEmbed({
                type: "editReply",
                components: match_select(false),
                image: `${p.assets.card.wide}`,
                author: {name: `${p.name}#${p.tag}`,iconURL: `${p.assets.card.small}`},
                title: `Valorant ${matchType} matches`,
                desc: "Select a recent match - Max 5. last matches are shown\n`Note: Interactable disables after 30 seconds`",
            }, interaction)

            const col = msg.createMessageComponentCollector({filter: i => i.user.id === interaction.user.id, time: 30000})

            col.on("collect", (i) => { 
                const [selected_match] = i.values
                const match_data = data.map(data => {
                    const teamA = data.players.red.map(player => {
                        return(`${agent_emojis[player.character]} ${player.name}#${player.tag} \`\`\`KDA: ${player.stats.kills}/${player.stats.deaths}/${player.stats.assists} | KDR: ${(player.stats.kills / player.stats.deaths).toFixed(2)}\`\`\``)
                    })

                    const teamB = data.players.blue.map(player => {
                        return(`${agent_emojis[player.character]} ${player.name}#${player.tag} \n\`\`\`KDA: ${player.stats.kills}/${player.stats.deaths}/${player.stats.assists} | KDR: ${(player.stats.kills / player.stats.deaths).toFixed(2)}\`\`\``)
                    })


                    return{
                        metadata: data.metadata,
                        player: data.players.red.find(data => data.name.toLowerCase() === user.toLowerCase() && data.tag.toLowerCase() === tagline.toLowerCase()) || data.players.blue.find(data => data.name.toLowerCase() === user.toLowerCase() && data.tag.toLowerCase() === tagline.toLowerCase()),
                        teamA: teamA,
                        teamB: teamB,
                        teams: data.teams
                    }
                }).filter(data => data.metadata.matchid === selected_match)


                client.basicEmbed({
                    type: "update",
                    author: {name: `${match_data[0].player.name}#${match_data[0].player.tag}`,iconURL: `${match_data[0].player.assets.card.small}`},
                    title: `[${match_data[0].metadata.region.toUpperCase()} - ${match_data[0].metadata.cluster}] ${match_data[0].metadata.mode} - ${match_data[0].metadata.map} | ${match_data[0].teams.red.rounds_won} : ${match_data[0].teams.blue.rounds_won}`, 
                    desc: `\`\`\`${match_data[0].metadata.game_start_patched}\`\`\``,
                    color: match_data[0].player.team == "Red" ? match_data[0].teams.red.has_won ? "#15a14a" : match_data[0].teams.blue.has_won ? "#ab1c15" : "#e37d10" : match_data[0].teams.blue.has_won ? "#15a14a" : match_data[0].teams.red.has_won ? "#ab1c15" : "#e37d10" || "#1e1e1e",
                    fields: [  
                        {name: "Match length", value: `\`\`\`${Math.trunc(Math.round(match_data[0].metadata.game_length / 1000) / 60)}m ${Math.trunc(((Math.round(match_data[0].metadata.game_length / 1000) / 60) - (Math.round(match_data[0].metadata.game_length / 1000) / 60).toString().slice(0, 2)) * 60)}s\`\`\``, inline: true},        
                        {name: "KDR", value: `\`\`\`${(match_data[0].player.stats.kills / match_data[0].player.stats.deaths).toFixed(2)}\`\`\``, inline: true},  
                        {name: "KDA", value: `\`\`\`${match_data[0].player.stats.kills}/${match_data[0].player.stats.deaths}/${match_data[0].player.stats.assists}\`\`\``, inline: true},  
                        {name: "Character", value: `\`\`\`${match_data[0].player.character}\`\`\``, inline: true},   
                        {name: "Econ Rating", value: `\`\`\`${Math.round(((match_data[0].player.damage_made / match_data[0].player.economy.spent.overall) * 1000))}\`\`\``, inline: true},   
                        {name: "Headshot %", value: `\`\`\`${Math.round((match_data[0].player.stats.headshots / (match_data[0].player.stats.bodyshots + match_data[0].player.stats.legshots)) * 100)}%\`\`\``, inline: true},   
                        {name: "Team Red", value: `${match_data[0].teamA.join("\n")}`, inline: true}, 
                        {name: "Team Blue", value: `${match_data[0].teamB.join("\n")}`, inline: true}       
                    ],
                    footer: {text: `Match-ID: ${match_data[0].metadata.matchid}`},
                }, i)
            })
            col.on("end", () => interaction.editReply({components: match_select(true)}))
            col.on("ignore", (i) => client.errEmbed({type: "reply", ephemeral: true, desc: "You cant use this menu"}, i))
        }
}
