import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Track, Player, Manager } from "erela.js";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { TextBasedChannelTypes, VoiceBasedChannelTypes } from "@sapphire/discord.js-utilities";
import { Client } from "discord.js";
import Set from "../../database/Manager/MusicManager";

@ApplyOptions<ListenerOptions>({
    name: "playerCreate",
    emitter: "manager" as keyof Client,
    event: "playerCreate"
})

export class pplayerCreateEvent extends Listener {
    async run(player: Player) {
        const data = await Set.findOne({ Guild: player.guild });
        if (data && data.Volume) player.setVolume(data.Volume);

        console.log(`💎 ${this.container.client.guilds.cache.get(player.guild)?.name}'s player created`)
    }
}
