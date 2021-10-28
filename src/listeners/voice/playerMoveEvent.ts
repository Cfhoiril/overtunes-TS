import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Track, Player } from "erela.js";
import { Client } from "discord.js";
import stay from "../../database/Manager/MusicManager";

@ApplyOptions<ListenerOptions>({
    name: "playerMove",
    emitter: "manager" as keyof Client,
    event: "playerMove"
})

export class playerMoveEvent extends Listener {
    async run(player: Player, newChannel: string, oldChannel: string) {
        if (oldChannel && newChannel) {
            player.voiceChannel = newChannel;

            if (player.paused) return;
            setTimeout(() => {
                player.pause(true);
                setTimeout(() => player.pause(false), this.container.client.ws.ping * 2);
            }, this.container.client.ws.ping * 2);
        } else {
            const prem = await stay.findOne({ Guild: player.guild });
            if (prem.Stay === true) {
                if (!player?.get("pause")) {
                    player?.pause(true);
                    player?.connect();
                    player?.pause(false);
                    setTimeout(() => {
                        if (this.container.client.guilds?.cache.get(player.guild)?.me?.voice.channel === null) return player.destroy();
                    }, 5000);
                    return;
                } else if (player?.get("pause") === true) {
                    player?.connect()
                    setTimeout(() => {
                        if (this.container.client.guilds?.cache.get(player.guild)?.me?.voice.channel === null) return player.destroy();
                    }, 5000);
                    return;
                } else if (player?.get("pause") === false) {
                    player?.pause(true);
                    player?.connect();
                    player?.pause(false);
                    setTimeout(() => {
                        if (this.container.client.guilds?.cache.get(player.guild)?.me?.voice.channel === null) return player.destroy();
                    }, 5000);
                    return;
                }
            }
            return player?.destroy();
        }
    }
}