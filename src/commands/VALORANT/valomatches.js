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
            .setName("tag")
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
            {name: "Swiftplay", value: "swiftplay"}
        )),
        async execute(client, interaction)
        {
            const user = interaction.options.get("username").value
            const tagline = interaction.options.get("tag").value
            const region = interaction.options.get("region").value
            const matchType = interaction.options.get("matchtype").value

            await interaction.deferReply()
            const matchHistory = await valorant1.getMatchData(region, user, tagline, matchType)

            const SelectMenu = (state) => [
                new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`${interaction.user.id}`)
                        .setPlaceholder('Select a match')
                        .setDisabled(state)
                        .addOptions(
                        matchHistory.data.map(data => {
                            return {
                                label: `${data.metadata.map} - ${data.metadata.mode}`,
                                value: `${data.metadata.matchid}`,
                                description: `Played at ${data.metadata.game_start_patched}`
                            }
                        })
                    )
                )
            ]

            const vl_msg = await client.basicEmbed({
                type: "editReply",
                author: {name: `Matches requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL() || interaction.user.defaultAvatarURL}`},
                components: SelectMenu(false),
                title: `Valorant recent ${matchType} matches [${user}#${tagline}]`,
                desc: "`Note: Interactable disables after 20 seconds`",
                fields: [
                    {name: "Select a Recent Match", value: "Max. 5 last Matches are shown."}
                ]
            }, interaction)

            const col = vl_msg.createMessageComponentCollector({filter: i => i.user.id === interaction.user.id, componentType: ComponentType.StringSelect, time: 20000 })
            col.on("collect", async(i) => { 
                const [selected] = i.values

                const match_data = await matchHistory.data.map(data => {
                    return{
                        metadata: data.metadata,
                        team_a: data.players.red,
                        team_b: data.players.blue,
                        teams: data.teams
                    } 
                }).filter(data => data.metadata.matchid === `${selected}`)

                const team_a = match_data[0].team_a.map(player => {
                    return(`${agent_emojis[player.character]} **${player.name}#${player.tag} | K/D/A: ${player.stats.kills}/${player.stats.deaths}/${player.stats.assists} | K/D: ${(player.stats.kills / player.stats.deaths).toFixed(2)}**`)
                })

                const team_b = match_data[0].team_b.map(player => {
                    return(`${agent_emojis[player.character]} **${player.name}#${player.tag} | K/D/A: ${player.stats.kills}/${player.stats.deaths}/${player.stats.assists} | K/D: ${(player.stats.kills / player.stats.deaths).toFixed(2)}**`)
                })
            
                const minutes = Math.round(match_data[0].metadata.game_length / 1000) / 60
                const seconds = (minutes - minutes.toString().slice(0, 2)) * 60

                client.basicEmbed({
                    type: "update",
                    author: {name: `Match requested by ${i.user.tag}`, iconURL: `${i.user.displayAvatarURL() || i.user.defaultAvatarURL}`},
                    title: `(${match_data[0].metadata.region.toUpperCase()}) ${match_data[0].metadata.map} - ${match_data[0].metadata.mode} Match from ${user}#${tagline}`,
                    desc: `Match-ID: ${match_data[0].metadata.matchid} (Patch: ${match_data[0].metadata.game_version.split("-")[1]})`,
                    fields: [
                        {name: "Match started", value: `<t:${match_data[0].metadata.game_start}:t>`, inline: true},
                        {name: "Match length", value: `${Math.trunc(minutes)}m ${Math.trunc(seconds)}s`, inline: true},
                        {name: "Server", value: `${match_data[0].metadata.cluster}`, inline: true},
                        {name: "Team A Team B", value: `**${match_data[0].teams.red.rounds_won}**  :  **${match_data[0].teams.blue.rounds_won}**`, inline: true},
                        {name: "Winner", value: `${match_data[0].teams.blue.has_won ? "Team B" : "Team A"}`, inline: true},
                        {name: "Played rounds", value: `${match_data[0].metadata.rounds_played}`, inline: true},
                        {name: "Team A", value: `${team_a.join("\n\n")}`, inline: false},
                        {name: "Team B", value: `${team_b.join("\n\n")}`, inline: false}                       
                    ]
                }, i)
            })

            col.on("ignore", async(i) => client.errEmbed({type: "reply", ephemeral: true, desc: `You cant use this menu.`}, i))
            col.on("end", async() => await interaction.editReply({components: SelectMenu(true)}))
                
        }
}
