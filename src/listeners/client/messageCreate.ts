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

        if (!msg.content.toLowerCase().startsWith(prefix.toLowerCase())) {
            let content = msg.content.trim();
            let mention1 = '<@!' + this.container.client.user?.id + '>';
            let mention2 = '<@' + this.container.client.user?.id + '>';

            if (content == mention1 || content == mention2)
                return msg.channel.send(`My prefix for this guild is **${prefix ?? config.prefix}**`)

            if (content.startsWith(mention1)) return;
            else if (content.startsWith(mention2)) return;
            else if (data.Channel === msg.channelId) {
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

                let player = this.container.client.manager.get(msg.guildId!);
                if (!player) {
                    player = this.container.client.manager.create({
                        guild: msg.guildId as string,
                        voiceChannel: msg.member?.voice.channelId as string,
                        textChannel: msg.channelId as string,
                        volume: 75,
                        selfDeafen: false,
                    })
                }

                if (player.state !== "CONNECTED") {
                    player.connect();
                    player.set("autoplay", false);
                }

                let res;
                const search = msg.content;

                try {
                    res = await player.search(search!, msg.author)
                    if (res.loadType === 'LOAD_FAILED') {
                        return msg.channel.send({
                            embeds: [new MessageEmbed()
                                .setAuthor("Something wrong when searching the track", undefined, "https://discord.gg/hM8U8cHtwu")
                                .setDescription(`\`\`\`${res.exception?.message!}\`\`\``)
                                .setColor("RED")
                            ]
                        })
                    }

                } catch (err) {
                    return msg.channel.send({
                        embeds: [new MessageEmbed()
                            .setAuthor("Something wrong when searching the track", undefined, "https://discord.gg/hM8U8cHtwu")
                            .setDescription(`\`\`\`${err}\`\`\``)
                            .setColor("RED")
                        ]
                    })
                }

                switch (res.loadType) {
                    case "NO_MATCHES":
                        return msg.channel.send({
                            embeds: [new MessageEmbed()
                                .setDescription("There were no results found")
                                .setColor("RED")
                            ]
                        });

                    case "SEARCH_RESULT":
                        player.queue.add(res.tracks[0]);
                        if (!player.playing && !player.paused && !player.queue.size) {
                            return player.play();
                        } else {
                            return msg.channel.send({
                                embeds: [new MessageEmbed()
                                    .setDescription(`Added ${res.tracks[0].title} [${msg.author}]`)
                                    .setColor(msg.guild?.me?.displayHexColor!)
                                    .setTimestamp()]
                            });
                        }

                    case "TRACK_LOADED":
                        player.queue.add(res.tracks[0]);
                        if (!player.playing && !player.paused && !player.queue.size) {
                            return player.play();
                        } else {
                            return msg.channel.send({
                                embeds: [new MessageEmbed()
                                    .setDescription(`Added ${res.tracks[0].title} [${msg.author}]`)
                                    .setColor(msg.guild?.me?.displayHexColor!)
                                    .setTimestamp()]
                            });
                        }

                    case "PLAYLIST_LOADED":
                        player.queue.add(res.tracks)
                        if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
                        return msg.channel.send({
                            embeds: [new MessageEmbed()
                                .setDescription(`Added ${res.tracks.length} tracks from ${res.playlist?.name}`)
                                .setColor(msg.guild?.me?.displayHexColor!)
                                .setTimestamp()]
                        });
                }

            }
        }
    }
}


