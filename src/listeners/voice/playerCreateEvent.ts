import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Client } from "discord.js";
import Set from "../../database/Manager/MusicManager";
import { ShoukakuPlayer } from "shoukaku";

@ApplyOptions<ListenerOptions>({
    name: "playerCreate",
    emitter: "manager" as keyof Client,
    event: "playerReady"
})

export class pplayerCreateEvent extends Listener {
    async run(name: string, player: ShoukakuPlayer) {
        const data = await Set.findOne({ Guild: player.connection.guildId });
        if (data && data.Volume) player.setVolume(data.Volume);

        console.log(`💎 ${this.container.client.guilds.cache.get(player.connection.guildId)?.name}'s player created`)
    }
}
