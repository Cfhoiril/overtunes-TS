import setting from "../../database/Manager/MusicManager";
import prefix from "../../database/Manager/GuildManager";
import * as config from "../../config.json";
import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Guild } from "discord.js";

@ApplyOptions<ListenerOptions>({
    name: "guildCreate"
})

export class rawEvent extends Listener {
    async run(guild: Guild) {
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
    }
}
