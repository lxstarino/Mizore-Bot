const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    cooldown: {
        time: 7000,
        message: "You are on cooldown, please wait 7 seconds",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Displays Information about a User")
    .addUserOption((option) => option
        .setName("target")
        .setDescription("target")
        .setRequired(true)
    ),
    async execute(client, interaction){
        const target = interaction.options.get("target")

        const Badges = {
            "HypeSquadOnlineHouse1": `${client.emojis.cache.find(emoji => emoji.id === "1079634402704887858")}`,
            "HypeSquadOnlineHouse2": `${client.emojis.cache.find(emoji => emoji.id === "1079634350284472330")}`,
            "HypeSquadOnlineHouse3": `${client.emojis.cache.find(emoji => emoji.id === "1079634360757653524")}`,
            "ActiveDeveloper": `${client.emojis.cache.find(emoji => emoji.id === "1080003443193827388")}`
        }

        const flags = target.user.flags.toArray()

        const badges = flags.map(flag => {
            if(Badges.hasOwnProperty(flag)){
                return Badges[flag]
            }
        })

        if(target.member){
            const member_roles = target.member._roles

            client.basicEmbed({
                type: "reply",
                thumbnail: `${target.user.displayAvatarURL()}`,
                fields: [
                    {name: `${target.user.tag} ${badges.join(" ")}`, value: `<@!${target.user.id}>`, inline: false},
                    {name: `Joined on`, value: `🗓️ <t:${Math.round(target.member.joinedTimestamp / 1000)}:D>`, inline: true},
                    {name: `Registered on`, value: `🗓️ <t:${Math.round(target.user.createdTimestamp / 1000)}:D>`, inline: true},
                    {name: `\u200b`, value: `\u200b`, inline: true},
                    {name: `Roles [${member_roles.length}]`, value: `${member_roles.length > 0 ? "<@&" +  member_roles.join("> <@&") + ">" : "This user dont have any roles"}`, inline: false},
                    {name: `Avatar`, value: `[Link](${target.user.displayAvatarURL({size: 1024})})`, inline: true},
                    {name: `MFA`, value: `${target.user.mfaEnabled ? "Enabled" : "Disabled"}`, inline: true}, 
                    {name: `Bot`, value: `${target.user.bot ? "Yes" : "No"}`, inline: true},
                ],
                timestamp: interaction.createdTimestamp,
                footer: {text: `ID: ${target.user.id}`}
            }, interaction)
        } else {
            client.basicEmbed({
                type: "reply",
                thumbnail: `${target.user.displayAvatarURL()}`,
                fields: [
                    {name: `${target.user.tag} ${badges.join(" ")}`, value: `<@!${target.user.id}>`, inline: false},
                    {name: `Registered on`, value: `🗓️ <t:${Math.round(target.user.createdTimestamp / 1000)}>`, inline: false},
                    {name: `Avatar Url`, value: `[Link](${target.user.displayAvatarURL({size: 1024})})`, inline: true},
                    {name: `MFA`, value: `${target.user.mfaEnabled ? "Enabled" : "Disabled"}`, inline: true}, 
                    {name: `Bot`, value: `${target.user.bot ? "Yes" : "No"}`, inline: true},
                ],
                timestamp: interaction.createdTimestamp,
                footer: {text: `ID: ${target.user.id}`}
            }, interaction)
        }

    }
}
