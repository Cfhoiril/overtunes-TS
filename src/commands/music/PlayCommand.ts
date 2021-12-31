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
    preconditions: ["inVoice", "canConnect", "isSpecialChannel"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");
        let guildPrefix = await prefix.findOne({ id: msg.guild?.id! });

        if (!argument.success) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor('RED')
                .setDescription(`To play a song you need to specify the track title, or you can try **${guildPrefix.prefix ?? config.prefix}play everything sucks**`)]
        });

        let player = this.container.client.audioQueue.get(msg.guild?.id);
        const node = this.container.client.audioManager.getNode()

        // ! check if the string is url
        if (this.checkUrl(argument.value)) {
            const res = await node.rest.resolve(argument.value);
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
        const search = await node.rest.resolve(argument.value, 'youtube');
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

    private checkUrl(url: string) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}
