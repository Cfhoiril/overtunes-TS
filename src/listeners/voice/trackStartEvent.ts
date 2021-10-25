import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Track, Player, Manager } from "erela.js";
import { Message, MessageEmbed } from "discord.js";
import { TextBasedChannelTypes, VoiceBasedChannelTypes } from "@sapphire/discord.js-utilities";
import { Client } from "discord.js";

@ApplyOptions<ListenerOptions>({
    name: "trackStart",
    emitter: "manager" as keyof Client,
    event: "trackStart"
})

export class trackStartEvent extends Listener {
    async run(player: Player, track: Track) {
        if (this.container.client.guilds.cache.get(player.guild)?.me?.voice.channel?.type === "GUILD_STAGE_VOICE")
            this.container.client.guilds.cache.get(player.guild)?.me?.voice.setRequestToSpeak(true);
        if (this.container.client.guilds.cache.get(player.guild)?.me?.voice.channel?.type === "GUILD_VOICE")
            this.container.client.guilds.cache.get(player.guild)?.me?.voice.setDeaf(true).catch(e => { });

        const channel = this.container.client.channels.cache.get(player.textChannel!) as TextBasedChannelTypes;
        const a = new MessageEmbed()
            .setTitle('Now playing')
            .setColor(this.container.client.guilds.cache.get(player.guild)?.me?.displayHexColor!)
            .setDescription(`${track.title} [${track.requester}]`)
            .setTimestamp()

        channel?.send({ embeds: [a] }).then(msgs => {
            const c = msgs.id;

            player.set("Message", c)

        }).catch(e => { })
    }
}
