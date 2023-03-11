const fs = require("fs")

module.exports = (client) => {
    const EventFolders = fs.readdirSync("./src/events")

    EventFolders.forEach(EventFolder => {
        const EventFiles = fs.readdirSync(`./src/events/${EventFolder}/`).filter(file => file.endsWith(".js"))

        EventFiles.forEach(EventFile => {
            const event = require(`../../events/${EventFolder}/${EventFile}`)
            client.on(event.name, (...args) => event.execute(...args, client))
        })
    })
}
