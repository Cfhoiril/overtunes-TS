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

        if (player.textChannel) channel.messages.fetch(player.get("Message")).then(x => x.delete()).catch(e => { });
        channel.send({
            embeds: [new MessageEmbed()
                .setColor("RED")
                .setDescription("Track is stuck, Skipping to next tracks")]
        }).then(ms => setTimeout(function () { ms.delete() }, 10000))
    }
}
