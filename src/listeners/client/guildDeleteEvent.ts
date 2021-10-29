import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import setting from "../../database/Manager/MusicManager";
import prefix from "../../database/Manager/GuildManager";
import { MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import * as config from "../../config.json";

@ApplyOptions<ListenerOptions>({
    name: "guildCreate"
})

export class rawEvent extends Listener {
    async run(guild: any) {
        prefix.findOneAndDelete({ id: guild.id }).catch(e => { })
        setting.findOneAndDelete({ Guild: guild.id }).catch(e => { })
    }
}
