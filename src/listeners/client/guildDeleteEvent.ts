import setting from "../../database/Manager/MusicManager";
import prefix from "../../database/Manager/GuildManager";

module.exports = function (client: any) {
    client.on("guildDelete", (guild: any) => {
        prefix.findOne({ id: guild.id }, async (data: any) => {
            if (data) data.delete()
        })

        setting.findOne({ Guild: guild.id }, async (data: any) => {
            if (data) data.delete()
        })

        const player = client.manager.get(guild.id)
        if (player) player.destroy();

        console.log(`🧺 Deleted database for ${guild.id}`)
    })
}
