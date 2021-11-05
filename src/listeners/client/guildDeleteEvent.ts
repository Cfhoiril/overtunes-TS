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
        prefix.findOne({ id: guild.id }, async (data: any) => {
            if (data) data.delete()
        })

        setting.findOne({ Guild: guild.id }, async (data: any) => {
            if (data) data.delete()
        })

        const player = this.container.client.manager.get(guild.id)
        if (player) player.destroy();

        console.log(`🧺 Deleted database for ${guild.id}`)
    }
}

