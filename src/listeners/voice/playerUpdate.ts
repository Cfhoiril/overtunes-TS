import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Client } from "discord.js";
import Set from "../../database/Manager/MusicManager";
import { Message, MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import { TextBasedChannelTypes, VoiceBasedChannelTypes } from "@sapphire/discord.js-utilities";
// @ts-expect-error
import { toColonNotation } from "colon-notation";
// @ts-expect-error
import date from "date-and-time";

// Normal Day
const images = [
    'https://cdn.discordapp.com/attachments/843462619158675487/890177507796594758/bg-2.jpg',
    'https://cdn.discordapp.com/attachments/843462619158675487/890181907394998282/bg-3.jpg',
    'https://cdn.discordapp.com/attachments/843462619158675487/890183030197583892/bg-3.jpg',
    'https://imgur.com/MFUY8Pm.jpg',
    'https://imgur.com/E5rn4eC.jpg'];

// Halloween
const imagesHalloween = [
    'https://imgur.com/Yrj7EMh.jpg',
    'https://imgur.com/SzAJDvG.jpg',
    'https://imgur.com/q8TBoqu.jpg'
];

@ApplyOptions<ListenerOptions>({
    name: "nodeRaw",
    emitter: "manager" as keyof Client,
    event: "nodeRaw"
})

export class nodeRawEvent extends Listener {
    async run(payload: any, msg: Message) {
        if (payload.op === "playerUpdate") {
            const player = this.container.client.manager.get(payload.guildId);
            if (player) {
                if (player.queue.current) {
                    const channel = this.container.client.channels.cache.get(player?.textChannel!) as TextBasedChannelTypes;

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

                    const check = await Set.findOne({ Guild: player?.guild });

                    if (!channel || channel === null) return check.Channel = null, check.Message = null, check.save();
                    if (!check || check.Channel === null || check.Message === null) return;
                    player.textChannel = check.Channel;

                    channel.messages.fetch(check.Message).catch(e => {
                        check.Channel = null
                        check.Message = null
                        check.save()

                        return channel.send({
                            embeds: [new MessageEmbed()
                                .setDescription('Template messages not found, back to normal mode')
                                .setColor('RED')
                            ]
                        });
                    })

                    let embeds = new MessageEmbed()
                        .setTitle('Now playing')
                        .setDescription(`${player?.queue.current?.title} [${player?.queue.current?.requester}]`)
                        .setColor(this.container.client.guilds?.cache?.get(player?.guild)?.me?.displayHexColor!)
                        .setImage(`${images[Math.floor(Math.random() * images.length)]}`)
                        .setFooter(`Duration: ${player?.queue.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration! ?? 1000)} | Total Songs: ${player?.queue?.size} | Volume: ${player?.volume}`)

                    let months = date.format(new Date(), 'MMMM');
                    if (months.toLowerCase().includes("october")) embeds.setImage(`${imagesHalloween[Math.floor(Math.random() * imagesHalloween.length)]}`);

                    let number = 0;
                    let queue = player.queue.slice(0, 5).map(x => `**${++number}.** ${x.title} - ${x.isStream ? "LIVE" : toColonNotation(x.duration ?? 1000)}`).reverse().join("\n")

                    channel.messages.fetch(check.Message).then(x => {
                        try {
                            x.edit({
                                content: `${player.queue.length > 0 ? `**Up Next:**\n${queue}` : "Join a voice channel then play something"}`,
                                embeds: [embeds],
                                components: [row]
                            })
                        } catch {
                            return;
                        }
                    })

                }
            }
        }
    }
}
