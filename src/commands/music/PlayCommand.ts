import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { TrackUtils } from "erela.js";
import { kazagumoTrack } from "kazagumo";
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

        const player = await this.container.client.musicManager.createPlayer({
            guildId: msg.guild?.id as string,
            shardId: msg.guild?.shardId as number,
            textId: msg.channel.id as string,
            voiceId: msg.member?.voice.channel?.id as string,
            deaf: false
        });

        const res = await player.search(argument.value, msg.author);
        if (!res.tracks.length) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription("No results matching the query found.")
                .setColor("RED")
            ]
        });

        const tracks = res.tracks;
        if (res.type === "PLAYLIST") {
            for (const track of tracks) {
                player.addSong(track!)
            }
        } else {
            player.addSong(tracks[0] as unknown as kazagumoTrack)
        }

        if (!player.playing) return player.play();

        if (res.type === "PLAYLIST") {
            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`Added ${tracks.length} tracks from ${res.playlistName}`)
                    .setColor(msg.guild?.me?.displayHexColor!)
                    .setTimestamp()]
            });
        } else {
            // msg.channel.send({
            //     embeds: [new MessageEmbed()
            //         .setDescription(`Added ${tracks[0]?.title} [${msg.author}]`)
            //         .setColor(msg.guild?.me?.displayHexColor!)
            //         .setTimestamp()]
            // });
        }
    }
}