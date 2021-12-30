import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import channel from "../../database/Manager/MusicManager";
import guild from "../../database/Manager/GuildManager";
import { Message, MessageEmbed } from "discord.js";
import * as config from "../../config.json";

@ApplyOptions<ListenerOptions>({
    name: "messageCreate",
})

export class messageCreate extends Listener {
    async run(msg: Message) {
        const data = await channel.findOne({ Guild: msg.guildId });
        if (data) {
            if (data.Channel) {
                if (data.Channel !== null && data.Channel == msg.channelId) {
                    if (msg.author.id !== this.container.client.user?.id) {
                        msg.delete().catch(e => { })
                    }
                    if (msg.author.id === this.container.client.user?.id) {
                        setTimeout(() => {
                            msg.delete().catch(e => { })
                        }, 10000);
                    }
                }
            }
        }

        if (msg.author.bot || !msg.guild) return;
        const data2 = await guild.findOne({ guild: msg.guildId });
        let prefix = data2.prefix ?? config.prefix;

        // check if messages started with prefix or not
        if (!msg.content.toLowerCase().startsWith(prefix.toLowerCase())) {
            let content = msg.content.trim();
            let mention1 = '<@!' + this.container.client.user?.id + '>';
            let mention2 = '<@' + this.container.client.user?.id + '>';

            if (content == mention1 || content == mention2)
                return msg.channel.send(`My prefix for this guild is **${prefix ?? config.prefix}**`)

            if (content.startsWith(mention1)) return;
            else if (content.startsWith(mention2)) return;
            else if (data) {
                if (data.Channel === msg.channelId) {
                    if (!msg.member?.voice?.channel) return msg.channel.send({
                        embeds: [new MessageEmbed()
                            .setDescription("You are not in the **Voice Channel**")
                            .setColor('RED')
                        ]
                    });

                    if (msg.member.voice.channel.type === 'GUILD_STAGE_VOICE') {
                        if (!msg.member.voice.channel.joinable) return msg.channel.send({
                            embeds: [new MessageEmbed()
                                .setDescription("I can't connect to your **Voice Channel**")
                                .setColor('RED')
                            ]
                        });
                    }

                    if (!msg.member?.voice?.channel?.permissionsFor(this.container.client.user!)?.has("CONNECT") || !msg.member?.voice?.channel?.permissionsFor(this.container.client.user!)?.has("SPEAK") || (msg.member.voice.channel.full && !msg.member?.voice?.channel?.permissionsFor(this.container.client.user!)?.has('MOVE_MEMBERS'))) {
                        return msg.channel.send({
                            embeds: [new MessageEmbed()
                                .setDescription("I can't connect to your **Voice Channel**")
                                .setColor('RED')
                            ]
                        });
                    }

                    let player = this.container.client.audioQueue.get(msg.guild?.id);
                    const node = this.container.client.audioManager.getNode()

                    if (player && msg.member.voice.channel !== msg.guild?.me?.voice?.channel) return msg.channel.send({
                        embeds: [new MessageEmbed()
                            .setColor("RED")
                            .setDescription(`You must be in the same channel as Me`)]
                    });

                    if (this.checkUrl(msg.content)) {
                        const res = await node.rest.resolve(msg.content);
                        if (!res || !res.tracks.length) {
                            return msg.channel.send({
                                embeds: [new MessageEmbed()
                                    .setDescription("No results matching the query found.")
                                    .setColor("RED")
                                ]
                            });
                        }

                        const { type, tracks, playlistName } = res;

                        const track = tracks.shift();
                        // @ts-ignore
                        track.info.requester = msg.author;
                        const isPlaylist = type === "PLAYLIST";
                        const result = await this.container.client.audioQueue.handle(msg, node, track!)

                        if (isPlaylist) {
                            for (const track of tracks) {
                                // @ts-ignore
                                track.info.requester = msg.author;
                                await this.container.client.audioQueue.handle(msg, node, track!);
                            }
                        }

                        // ! send playlist message if tracks is playlist
                        if (isPlaylist) {
                            msg.channel.send({
                                embeds: [new MessageEmbed()
                                    .setDescription(`Added ${tracks.length} tracks from ${playlistName}`)
                                    .setColor(msg.guild?.me?.displayHexColor!)
                                    .setTimestamp()]
                            });
                        }
                        // if not
                        else {
                            msg.channel.send({
                                embeds: [new MessageEmbed()
                                    .setDescription(`Added ${track?.info.title} [${msg.author}]`)
                                    .setColor(msg.guild?.me?.displayHexColor!)
                                    .setTimestamp()]
                            });

                        }

                        result?.play()
                        return;
                    }
                    const search = await node.rest.resolve(msg.content, 'youtube');
                    if (!search || !search.tracks.length) {
                        return msg.channel.send({
                            embeds: [new MessageEmbed()
                                .setDescription("No results matching the query found.")
                                .setColor("RED")
                            ]
                        });
                    }

                    const track = search.tracks.shift();
                    // @ts-ignore
                    track.info.requester = msg.author;
                    const res = await this.container.client.audioQueue.handle(msg, node, track!);
                    msg.channel.send({
                        embeds: [new MessageEmbed()
                            .setDescription(`Added ${track?.info?.title} [${msg.author}]`)
                            .setColor(msg.guild?.me?.displayHexColor!)
                            .setTimestamp()]
                    });

                    res?.play();

                }
            }
        }
    }

    private checkUrl(url: string) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}


