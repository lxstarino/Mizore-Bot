require("dotenv").config()
const fs = require("fs")
const { Client, Collection, GatewayIntentBits } = require("discord.js")

const client = new Client({
    intents: [        
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers
    ]
})

client.commands = new Collection()

const folders = fs.readdirSync("./src/handlers")

process.on('unhandledRejection', error => {
	console.error(`Unhandled promise rejection: ${error}`);
});

for(directory of folders){
	const handlers = fs.readdirSync(`./src/handlers/${directory}`).filter(file => file.endsWith(".js"))
	for(file of handlers){
		require(`./handlers/${directory}/${file}`)(client)
	}
}

client.login(process.env.token)
