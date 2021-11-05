import setting from "../../database/Manager/MusicManager";
import prefix from "../../database/Manager/GuildManager";
import * as config from "../../config.json";
import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Guild } from "discord.js";

@ApplyOptions<ListenerOptions>({
    name: "guildDelete"
})

export class rawEvent extends Listener {
    async run(guild: Guild) {

        prefix.findOneAndDelete({ id: guild.id })
        setting.findOneAndDelete({ Guild: guild.id })

        const player = this.container.client.manager.get(guild.id)
        if (player) player.destroy()

        console.log(`🧺 Deleted database for ${guild.id}`)
    }
}

