import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Track, Player, Manager } from "erela.js";
import { Message, MessageEmbed } from "discord.js";
import { TextBasedChannelTypes, VoiceBasedChannelTypes } from "@sapphire/discord.js-utilities";
import { Client } from "discord.js";

@ApplyOptions<ListenerOptions>({
    name: "trackError",
    emitter: "manager" as keyof Client,
    event: "trackError"
})

export class trackErrorEvent extends Listener {
    async run(player: Player, track: Track) {
        if (!player?.voiceChannel) player.destroy();
        const channel = this.container.client.channels.cache.get(player.textChannel!) as TextBasedChannelTypes;

        if (player.get("Message")) channel.messages.fetch(player.get("Message")).then(x => x.delete()).catch(e => { });
        channel.send({
            embeds: [new MessageEmbed()
                .setColor("RED")
                .setDescription("Track is error, Skipping to next tracks")]
        }).then(ms => setTimeout(function () { ms.delete() }, 10000))
    }
}
