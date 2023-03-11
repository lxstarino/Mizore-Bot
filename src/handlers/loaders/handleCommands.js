require("dotenv").config()
const fs = require("fs")
const { REST, Routes, Collection } = require("discord.js")

const commands = []
module.exports = (client) => {
    const commandFolders = fs.readdirSync("./src/commands")

    commandFolders.forEach(Folder => {
        const commandFiles = fs.readdirSync(`./src/commands/${Folder}/`).filter(file => file.endsWith(".js"))

        commandFiles.forEach(commandFile => {
            const command = require(`../../commands/${Folder}/${commandFile}`)
            const properties = {Folder, ...command}

            client.commands.set(command.data.name, properties)   
            commands.push(command.data.toJSON())
        })
    })

    

    const restClient = new REST({version: "9"}).setToken(process.env.token)
    
    restClient.put(Routes.applicationCommands(process.env.appid), {
        body: commands})
        .then(() => console.log("Commands registered"))
        .catch(console.error)
}










