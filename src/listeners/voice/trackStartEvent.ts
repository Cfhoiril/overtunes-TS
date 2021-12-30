import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { Client } from "discord.js";
import Set from "../../database/Manager/MusicManager";
import { ShoukakuPlayer } from "shoukaku";

@ApplyOptions<ListenerOptions>({
    name: "trackStart",
    emitter: "audioManager" as keyof Client,
    event: "playerTrackStart"
})

export class trackStartEvent extends Listener {
    async run(shoukakuPlayer: ShoukakuPlayer) {
        const player = this.container.client.audioQueue.get(shoukakuPlayer.connection.guildId);

        if (player.timeout) clearTimeout(player.timeout);

        if (this.container.client.guilds.cache.get(player.guild.id)?.me?.voice.channel?.type === "GUILD_STAGE_VOICE")
            this.container.client.guilds.cache.get(player.guild.id)?.me?.voice?.setSuppressed(false).catch(e => { this.container.client.guilds.cache.get(player.connection.guildId)?.me?.voice?.setRequestToSpeak(true) })
        if (this.container.client.guilds.cache.get(player.guild.id)?.me?.voice.channel?.type === "GUILD_VOICE")
            this.container.client.guilds.cache.get(player.guild.id)?.me?.voice.setDeaf(true).catch(e => { });

        let special = await Set.findOne({ Guild: player.guild.id });

        if (special && special.Channel !== null && special.Message !== null) {
            player.text.messages.fetch(special.Message).catch(() => {
                special.Channel = null
                special.Message = null

                special.save()
                return player.text.send({
                    embeds: [new MessageEmbed()
                        .setDescription('Template messages not found, back to normal mode')
                        .setColor('RED')
                    ]
                })
            });

            player.text.messages.fetch({
                limit: 10
            }).then((messages: Array<Message>) => {
                messages.filter(m => m.id != special.Message).map(delMessage => {
                    delMessage.delete()
                })
            })
        } else {
            if (special && special.Channel === player.textChannel) return;
            if (special.Announce) {
                const a = new MessageEmbed()
                    .setTitle('Now playing')
                    .setColor(player.guild?.me?.displayHexColor!)
                    .setDescription(`${player.current.info.title} [${player.current.info.requester}]`)
                    .setTimestamp()

                player.text.send({ embeds: [a] }).then((msgs: Message) => {
                    player.message = msgs
                }).catch(() => null)
            }
        }

        console.log(`🎶 ${player.guild.name} started playing ${player.current.info.title}`)
    }
}
