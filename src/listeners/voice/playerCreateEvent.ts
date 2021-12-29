import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Client } from "discord.js";
import Set from "../../database/Manager/MusicManager";
import { ShoukakuPlayer } from "shoukaku";

@ApplyOptions<ListenerOptions>({
    name: "playerCreate",
    emitter: "audioManager" as keyof Client,
    event: "playerReady"
})

export class pplayerCreateEvent extends Listener {
    async run(name: string, shoukakuPlayer: ShoukakuPlayer) {
        console.log(`💎 ${this.container.client.guilds.cache.get(shoukakuPlayer.connection.guildId)}'s player created`)
    }
}
