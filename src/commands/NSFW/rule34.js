const { SlashCommandBuilder, codeBlock } = require("@discordjs/builders")
const rule34 = require("../../api/rule34")
const rule34_1 = new rule34()

module.exports = {
    nsfw: true,
    cooldown: {
        time: 5000,
        message: "You are on cooldown, please wait 5 seconds!",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("rl34")
    .setDescription("Displays rule34 image(s)")
    .addStringOption((option) => option
        .setName("tag")
        .setDescription("tag")
        .setMinLength(3)
        .setRequired(true)
    ).addNumberOption((option) => option
        .setName("amount")  
        .setDescription("amount")
        .setMaxValue(5)
        .setMinValue(1)
        .setRequired(true)
    ).addStringOption((option) => option
        .setName("filter")
        .setDescription("filter")
        .addChoices(
            {name: ".mp4", value: ".mp4"},
            {name: ".gif", value: ".gif"},
            {name: ".jpg", value: ".jpg"},
            {name: ".jpeg", value: ".jpeg"},
            {name: ".png", value: ".png"}
        )
    ),
    async execute(client, interaction) {
        const tag = interaction.options.get("tag").value
        const amount = interaction.options.get("amount").value
        const filter = interaction.options.get("filter") ? interaction.options.get("filter").value : undefined

        await interaction.deferReply()
        const images = await rule34_1.getImages(tag, 3, amount, filter)

        await interaction.editReply(codeBlock("js",`🔞 Rule34 - "/rl34 ${tag} ${amount}"`) + `\n${images.join('\n')}`)
    }
}
