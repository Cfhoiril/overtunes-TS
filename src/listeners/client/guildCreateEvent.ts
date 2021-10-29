import setting from "../../database/Manager/MusicManager";
import prefix from "../../database/Manager/GuildManager";
import * as config from "../../config.json";

module.exports = function (client: any) {
    client.on("guildCreate", (guild: any) => {
        new setting({
            Guild: guild.id,
            Stay: false,
            Announce: true,
            Dj: false
        }).save()

        new prefix({
            id: guild.id,
            prefix: config.prefix
        }).save()

        console.log(`🚄 Initiated database for ${guild.id}`)
    })
}