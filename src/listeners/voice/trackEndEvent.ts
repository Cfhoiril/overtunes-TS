import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Track, Player, Manager } from "erela.js";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { TextBasedChannelTypes, VoiceBasedChannelTypes } from "@sapphire/discord.js-utilities";
import { Client } from "discord.js";
import Set from "../../database/Manager/MusicManager";

@ApplyOptions<ListenerOptions>({
    name: "trackEnd",
    emitter: "manager" as keyof Client,
    event: "trackEnd"
})

export class trackEndEvent extends Listener {
    async run(player: Player, track: Track) {
        player.queue.previous = track;

        const channel = this.container.client.channels.cache.get(player.textChannel!) as TextBasedChannelTypes;
        if (player.get("Message")) channel.messages.fetch(player.get("Message")).then(x => x.delete()).catch(e => { });

        const embed = new MessageEmbed()
            .setTitle('No Music currently playing')
            .setDescription("[Commands](https://overtunes.me/commands) | [Invite](https://discord.com/oauth2/authorize?client_id=873101608467185684&scope=bot&permissions=4332047432&scope=applications.commands%20bot) | [Support](https://discord.gg/hM8U8cHtwu)")
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

        const autoplay = player.get("autoplay")
        if (autoplay === true) {
            const requester = player.get("requester");
            const identifier = player.queue.current?.identifier;
            const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            let res = await player.search(search, requester);
            player.queue.add(res.tracks[3]);
        }

        const data = await Set.findOne({ Guild: player.guild });

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
