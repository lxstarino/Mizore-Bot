const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    cooldown: {
        time: 3000,
        message: "You are on cooldown, please wait 3 seconds",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("genpw")
    .setDescription("Generate a password")
    .addBooleanOption((option) => option
        .setName("numbers")
        .setDescription("Determines whether the password should contain numbers or not")
    ).addBooleanOption((option) => option
        .setName("symbols")
        .setDescription("Determines whether the password should contain symbols or not")
    ),
    async execute(client, interaction){
        const numbers = interaction.options.get("numbers") ? interaction.options.get("numbers").value : false
        const symbols = interaction.options.get("symbols") ? interaction.options.get("symbols").value : false

        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        if(numbers != false){
            characters += "123456789"
        }
        if(symbols != false){
            characters += ":;.$*"
        }
    
        let pw = ""
        for(i = 0; i < 16; i++){
            pw += characters.charAt(Math.floor(Math.random() * characters.length))
        }

        client.successEmbed({
            type: "reply",
            ephemeral: true,
            desc: "I have generate a password and have it sent to your DM"
        }, interaction)

        client.basicEmbed({
            ephemeral: true,
            title: "Generate Password",
            fields: {name: "Your password", value: `${pw}`}
        }, interaction.user)
    }
}
