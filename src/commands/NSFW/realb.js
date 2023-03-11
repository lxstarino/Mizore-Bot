const { SlashCommandBuilder, codeBlock } = require("@discordjs/builders")
const realb = require("../../api/realb")
const realb1 = new realb()

module.exports = {
    nsfw: true,
    cooldown: {
        time: 5000,
        message: "You are on cooldown, please wait 5 seconds!",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("rb")
    .setDescription("Displays porn image(s)")
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
            {name: ".webm", value: ".webm"},
            {name: ".gif", value: ".gif"},
            {name: ".jpeg", value: ".jpeg"},
            {name: ".png", value: ".png"}
        )
    ),
    async execute(client, interaction) {
        const tag = interaction.options.get("tag").value
        const amount = interaction.options.get("amount").value
        const filter = interaction.options.get("filter") ? interaction.options.get("filter").value : undefined

        await interaction.deferReply()
        const images = await realb1.getImages(tag, 3, amount, filter)

        await interaction.editReply(codeBlock("js", `🔞 Realbooru - "/rb ${tag} ${amount}"`) + `\n${images.join('\n')}`)
    }
}
