const { EmbedBuilder } = require("discord.js")

module.exports = (client) => {
    client.tempEmbed = function() {
        return new EmbedBuilder()
            .setColor("#a48cc3")
    }

    client.successEmbed = function({
        embed: embed = client.tempEmbed(),
        title: title,
        desc: desc,
        color: color,
        type: type,
        components: components,
        ephemeral: ephemeral
    }, interaction){
        const emoji = client.emojis.cache.find(emoji => emoji.id === "1084132320841302086") || "✅"
        if(title){embed.setDescription(`${emoji}**${title}**${desc ? `\n>>> ${desc}` : ""}`)}else{embed.setDescription(`${emoji} **Successful**${desc ? `\n>>> ${desc}` : ""}`)}
        if(color){embed.setColor(color)}else{embed.setColor("#24664c")}

        return client.sendEmbed({
            type: type,
            embeds: [embed],
            components: components,
            ephemeral: ephemeral
        }, interaction)
    }

    client.errEmbed = function({
        embed: embed = client.tempEmbed(),
        title: title,
        desc: desc,
        color: color,
        type: type,
        components: components,
        ephemeral: ephemeral
    }, interaction){
        const emoji = client.emojis.cache.find(emoji => emoji.id === "1084131240304717904") || "❌"
        if(title){embed.setDescription(`${emoji}**${title}**${desc ? `\n>>> ${desc}` : ""}`)}else{embed.setDescription(`${emoji} **Error**${desc ? `\n>>> ${desc}` : ""}`)}
        if(color){embed.setColor(color)}else{embed.setColor("#880c2c")}
        return client.sendEmbed({
            type: type,
            embeds: [embed],
            components: components,
            ephemeral: ephemeral
        }, interaction)
    }

    client.basicEmbed = function({
        embed: embed = client.tempEmbed(),
        title: title,
        desc: desc,
        color: color,
        image: image,
        url: url,
        author: author,
        thumbnail: thumbnail,
        footer: footer,
        fields: fields,
        timestamp: timestamp,
        type: type,
        components: components,
        ephemeral: ephemeral
    }, interaction){
        if(title) embed.setTitle(title)
        if(desc) embed.setDescription(desc)
        if(color) embed.setColor(color)
        if(image) embed.setImage(image)
        if(url) embed.setURL(url)
        if(fields) embed.addFields(fields)
        if(thumbnail) embed.setThumbnail(thumbnail)
        if(footer) embed.setFooter(footer)
        if(author) embed.setAuthor(author)
        if(timestamp) embed.setTimestamp(timestamp)

        return client.sendEmbed({
            type: type,
            embeds: [embed],
            components: components,
            ephemeral: ephemeral
        }, interaction)
    }

    client.sendEmbed = async function({
        type: type,
        embeds: [embeds],
        components: components,
        ephemeral: ephemeral
    }, interaction){
        switch(type){
            case "reply":
                return await interaction.reply({
                    embeds: [embeds],
                    components: components,
                    ephemeral: ephemeral,
                    fetchReply: true
                }).catch((err) => {console.log("Reply Error:\n" + err)})
            case "editReply":
                return await interaction.editReply({
                    embeds: [embeds],
                    components: components,
                    fetchReply: true
                }).catch((err) => {console.log("EditReply Error:\n" + err)})
            case "update":
                return await interaction.update({
                    embeds: [embeds],
                    components: components,
                    fetchReply: true
                }).catch((err) => {console.log("Update Error:\n" + err)})
            case "followUp":
                return await interaction.followUp({
                    embeds: [embeds],
                    components: components,
                    ephemeral: ephemeral,
                    fetchReply: true
                }).catch((err) => {console.log("followUp Error:\n" + err)})
            default:
                return await interaction.send({
                    embeds: [embeds],
                    components: components,
                    fetchReply: true
                }).catch((err) => {console.log("Send Error:\n" + err)})
        }
    }
}
