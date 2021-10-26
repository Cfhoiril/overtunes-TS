import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { TrackUtils } from "erela.js";
import * as config from "../../config.json";
import prefix from "../../database/Manager/GuildManager";

@ApplyOptions<CommandOptions>({
    name: "play",
    aliases: ["p"],
    requiredClientPermissions: ["CONNECT", "SPEAK"],
    preconditions: ["inVoice", "canConnect", "sameVoice", "isSpecialChannel"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");
        let player = this.container.client.manager.get(msg.guild?.id!);
        let guildPrefix = await prefix.findOne({ id: msg.guild?.id! })

        if (!argument.success) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor('RED')
                .setDescription(`To play song u need specify the track title, or you can try **${guildPrefix.prefix ?? config.prefix}play everything sucks**`)]
        });

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
        const search = argument.value;

        try {
            res = await player.search(search, msg.author)
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
                        .setDescription(`Added ${res.tracks.length} songs from ${res.playlist?.name}`)
                        .setColor(msg.guild?.me?.displayHexColor!)
                        .setTimestamp()]
                });
        }
    }
}