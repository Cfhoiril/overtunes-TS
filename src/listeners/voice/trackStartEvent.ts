import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Track, Player, Manager } from "erela.js";
import { Message, MessageEmbed, TextChannel, Snowflake } from "discord.js";
import { TextBasedChannelTypes, VoiceBasedChannelTypes } from "@sapphire/discord.js-utilities";
import { Client } from "discord.js";
import Set from "../../database/Manager/MusicManager";
import { ShoukakuPlayer } from "shoukaku"
@ApplyOptions<ListenerOptions>({
    name: "trackStart",
    emitter: "audioManager" as keyof Client,
    event: "playerTrackStart"
})

export class trackStartEvent extends Listener {
    async run(player: ShoukakuPlayer) {
        if (this.container.client.guilds.cache.get(player.guild)?.me?.voice.channel?.type === "GUILD_STAGE_VOICE")
            this.container.client.guilds.cache.get(player.guild)?.me?.voice?.setSuppressed(false).catch(e => { this.container.client.guilds.cache.get(player.guild)?.me?.voice?.setRequestToSpeak(true) })
        if (this.container.client.guilds.cache.get(player.guild)?.me?.voice.channel?.type === "GUILD_VOICE")
            this.container.client.guilds.cache.get(player.guild)?.me?.voice.setDeaf(true).catch(e => { });

        const channel = this.container.client.channels.cache.get(player.textChannel!) as TextBasedChannelTypes;
        let special = await Set.findOne({ Guild: player.guild });

        if (special && special.Channel !== null && special.Message !== null) {
            channel.messages.fetch(special.Message).catch(e => {
                special.Channel = null
                special.Message = null

                special.save()
                return channel.send({
                    embeds: [new MessageEmbed()
                        .setDescription('Template messages not found, back to normal mode')
                        .setColor('RED')
                    ]
                })
            });

            channel.messages.fetch({
                limit: 10
            }).then((messages) => {
                messages.filter(m => m.id != special.Message).map(delMessage => {
                    delMessage.delete()
                })
            })
        } else {
            if (special && special.Channel === player.textChannel) return;
            if (special.Announce === true) {
                const a = new MessageEmbed()
                    .setTitle('Now playing')
                    .setColor(this.container.client.guilds.cache.get(player.guild)?.me?.displayHexColor!)
                    .setDescription(`${track.title} [${track.requester}]`)
                    .setTimestamp()

                channel?.send({ embeds: [a] }).then(msgs => {
                    player.set("Message", msgs)
                }).catch(e => { })
            }
        }

        console.log(`🎶 ${this.container.client.guilds.cache.get(player.guild)?.name} started playing ${track.title}`)
    }
}
