import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Track, Player, Manager } from "erela.js";
import { Message, MessageEmbed } from "discord.js";
import { TextBasedChannelTypes, VoiceBasedChannelTypes } from "@sapphire/discord.js-utilities";
import { Client } from "discord.js";

@ApplyOptions<ListenerOptions>({
    name: "trackStuck",
    emitter: "manager" as keyof Client,
    event: "trackStuck"
})

export class trackStuckEvent extends Listener {
    async run(player: Player, track: Track) {
        if (!player?.voiceChannel) player.destroy();
        const channel = this.container.client.channels.cache.get(player.textChannel!) as TextBasedChannelTypes;

        // @ts-expect-error
        if (player.get("Message")) player.get("Message").delete().catch(() => { });
        channel.send({
            embeds: [new MessageEmbed()
                .setColor("RED")
                .setDescription(`Track is stuck, Skipping to next tracks`)]
        }).then(ms => setTimeout(function () { ms.delete() }, 10000))
    }
}
