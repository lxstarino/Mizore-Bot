const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    cooldown: {
        time: 3000,
        message: "You are on cooldown, please wait 3 seconds",
        users: new Set()
    },
    data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Question the 8Ball Oracle")
    .addStringOption((option) => option
        .setName('question')
        .setMaxLength(100)
        .setMinLength(4)
        .setDescription("The question you want to ask")
        .setRequired(true)
    ),
    async execute(client, interaction) {
        const question = interaction.options.get('question').value

        const answer_list = ["Yes definitely", "Why you asking me this?", "Yes", "No", "yesse", "ye", "Im not gonna answer this", "Maybe..", "No.. just no", "YEEEEEES", "Ask again later", "||Yes||", "||No||", "My sources say no", "I dont know", "No way.", "Dont ask me again", "?"]

        client.basicEmbed({
            type: "reply",
            title: "🔮・8Ball",
            desc: `**Question**: ${question}`,
            fields: [
                {name: "Answer", value: `${answer_list[Math.floor(Math.random() * answer_list.length)]}`}
            ]
        }, interaction)
    }
}
