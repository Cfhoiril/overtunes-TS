import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Client } from "discord.js";
import Set from "../../database/Manager/MusicManager";
import { ShoukakuPlayer } from "shoukaku";
import shoukaku from "../../config/shoukaku";

@ApplyOptions<ListenerOptions>({
    name: "playerCreate",
    emitter: "audioManager" as keyof Client,
    event: "playerReady"
})

export class pplayerCreateEvent extends Listener {
    async run(name: string, shoukakuPlayer: ShoukakuPlayer) {
        const data = await Set.findOne({ Guild: shoukakuPlayer.connection.guildId });
        if (!data.Volume) shoukakuPlayer.setVolume(75 / 100);
        if (data && data.Volume) shoukakuPlayer.setVolume(data.Volume / 100);

        console.log(`💎 ${this.container.client.guilds.cache.get(shoukakuPlayer.connection.guildId)}'s player created`)
    }
}
