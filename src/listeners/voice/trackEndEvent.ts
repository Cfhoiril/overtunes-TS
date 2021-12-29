import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { Client } from "discord.js";
import Set from "../../database/Manager/MusicManager";
import { ShoukakuPlayer } from "shoukaku";

@ApplyOptions<ListenerOptions>({
    name: "trackEnd",
    emitter: "audioManager" as keyof Client,
    event: "playerTrackEnd"
})

export class trackEndEvent extends Listener {
    async run(shoukakuPlayer: ShoukakuPlayer) {
        const player = this.container.client.audioQueue.get(shoukakuPlayer.connection.guildId);

        player.play();
        player.previous = player.current;

        if (player.repeat === 1) player.queue.unshift(player.previous);
        else if (player.repeat === 2) player.queue.push(player.previous);

        if (player.message) player.message.delete().catch(() => null);

        const embed = new MessageEmbed()
            .setTitle('No Music currently playing')
            .setDescription("[Commands](https://overtunes.me/commands) | [Invite](https://discord.com/oauth2/authorize?client_id=873101608467185684&scope=bot&permissions=4332047432&scope=applications.commands%20bot) | [Support](https://discord.gg/hM8U8cHtwu)")
            .setColor(player.guild?.me?.displayHexColor!)
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

        // const autoplay = player.get("autoplay")
        // if (autoplay === true) {
        //     const requester = player.get("requester");
        //     const identifier = player.queue.current?.identifier;
        //     const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
        //     let res = await player.search(search, requester);
        //     player.queue.add(res.tracks[3]);
        // }

        const data = await Set.findOne({ Guild: player.guild.id });
        if (!data.Stay) {
            if (player.timeout) clearTimeout(player.timeout);
            player.timeout = setTimeout(() => {
                player.text.send({
                    embeds: [new MessageEmbed()
                        .setDescription('I left the voice channel because I was inactive for too long.If you are satisfied with our service, please vote for us by [clicking here](https://top.gg/bot/873101608467185684/vote/)')
                        .setColor(player.guild?.me?.displayHexColor!)
                    ]
                })
                clearTimeout(player.timeout);
                player.destroy()
            }, 600000)
        }

        // Special Channel Handler
        if (!data || data.Channel === null || data.Message === null) return;
        player.text.messages.fetch(data.Message).catch(() => {
            data.Channel = null
            data.Message = null

            data.save()
            return player.text.send({
                embeds: [new MessageEmbed()
                    .setDescription('Template messages not found, back to normal mode')
                    .setColor('RED')
                ]
            })
        })

        player.text.messages.fetch(data.Message).then((x: Message) => {
            try {
                x.edit({ content: 'Join a voice channel then play something', embeds: [embed], components: [row] })
            } catch {
                return;
            }
        })

    }
}
