import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Track, Player, Manager } from "erela.js";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { TextBasedChannelTypes, VoiceBasedChannelTypes } from "@sapphire/discord.js-utilities";
import { Client } from "discord.js";
import Set from "../../database/Manager/MusicManager";

@ApplyOptions<ListenerOptions>({
    name: "queueEnd",
    emitter: "manager" as keyof Client,
    event: "queueEnd"
})

export class queueEndEvent extends Listener {
    async run(player: Player, track: Track) {
        player.queue.previous = track;

        const channel = this.container.client.channels.cache.get(player.textChannel!) as TextBasedChannelTypes;
        if (player.get("Message")) channel.messages.fetch(player.get("Message")).then(x => x.delete()).catch(e => { });

        const embed = new MessageEmbed()
            .setTitle('No Music currently playing')
            .setDescription("[Commands](https://overtunes.netlify.app/docs/basic-use/commands) | [Invite](https://overtunes.netlify.app/docs/get-started/inviting-the-bot) | [Support](https://discord.gg/hM8U8cHtwu)")
            .setColor(this.container.client.guilds?.cache?.get(player?.guild)?.me?.displayHexColor!)
            .setImage('https://cdn.discordapp.com/attachments/843462619158675487/890162871915393024/386720.jpeg')

        let stop = new MessageButton()
            .setStyle('PRIMARY')
            .setCustomId('stop1')
            .setLabel('⏹')

        let next = new MessageButton()
            .setStyle('PRIMARY')
            .setCustomId('skip1')
            .setLabel('⏭️')

        let pause = new MessageButton()
            .setCustomId('pause1')
            .setLabel(`${player?.paused ? '▶' : '⏸'}`)
            .setStyle(`${player?.paused ? 'SUCCESS' : 'PRIMARY'}`)

        let loop = new MessageButton()
            .setStyle(`${player?.queueRepeat ? 'SUCCESS' : player?.trackRepeat ? 'SUCCESS' : 'PRIMARY'}`)
            .setLabel(`${player?.queueRepeat ? '🔁' : player?.trackRepeat ? '🔂' : '🔁'}`)
            .setCustomId('loop1')


        let shuffle = new MessageButton()
            .setStyle('PRIMARY')
            .setLabel('🔀')
            .setCustomId('shuffle1')

        let row = new MessageActionRow()
            .addComponents(stop)
            .addComponents(shuffle)
            .addComponents(pause)
            .addComponents(next)
            .addComponents(loop)

        const data = await Set.findOne({ Guild: player.guild });
        if (!data) {
            // @ts-expect-error
            player.timeout = setTimeout(() => {
                if (!player.queue.current) {
                    const channel = this.container.client.channels.cache.get(player.textChannel!) as TextBasedChannelTypes;
                    channel.send({
                        embeds: [new MessageEmbed()
                            .setDescription('I left the voice channel because I was inactive for too long.If you are satisfied with our service, please vote for us by [clicking here](https://top.gg/bot/873101608467185684/vote/)')
                            .setColor(this.container.client.guilds.cache.get(player.guild)?.me?.displayHexColor!)
                        ]
                    })
                    player.destroy()
                }
            }, 600000)
        } else if (data.Stay === false) {
            // @ts-expect-error
            player.timeout = setTimeout(() => {
                if (!player.queue.current) {
                    const channel = this.container.client.channels.cache.get(player.textChannel!) as TextBasedChannelTypes;
                    channel.send({
                        embeds: [new MessageEmbed()
                            .setDescription('I left the voice channel because I was inactive for too long.If you are satisfied with our service, please vote for us by [clicking here](https://top.gg/bot/873101608467185684/vote/)')
                            .setColor(this.container.client.guilds.cache.get(player.guild)?.me?.displayHexColor!)
                        ]
                    })
                    player.destroy()
                }
            }, 600000)
        }

        // Special Channel Handler
        if (!data || data.Channel === null || data.Message === null) return;
        channel.messages.fetch(data.Message).catch(e => {
            data.Channel = null
            data.Message = null

            data.save()
            return channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('Template messages not found, back to normal mode')
                    .setColor('RED')
                ]
            })
        })

        channel.messages.fetch(data.Message).then(x => {
            try {
                x.edit({ content: 'Join a voice channel then play something', embeds: [embed], components: [row] })
            } catch {
                return;
            }
        })

    }
}
