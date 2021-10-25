import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Track, Player, Manager } from "erela.js";
import { Message, MessageEmbed } from "discord.js";
import { TextBasedChannelTypes, VoiceBasedChannelTypes } from "@sapphire/discord.js-utilities";
import { Client } from "discord.js";

@ApplyOptions<ListenerOptions>({
    name: "queueEnd",
    emitter: "manager" as keyof Client,
    event: "queueEnd"
})

export class queueEndEvent extends Listener {
    async run(player: Player, track: Track) {
        player.queue.previous = track;

        const channel = this.container.client.channels.cache.get(player.textChannel!) as TextBasedChannelTypes;
        if (player.textChannel) channel.messages.fetch(player.get("Message")).then(x => x.delete()).catch(e => { });


    }
}
