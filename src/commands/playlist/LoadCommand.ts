import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import playlist from "../../database/Manager/PlaylistManager";
import { TrackUtils } from "erela.js";

@ApplyOptions<CommandOptions>({
    name: "load",
    preconditions: ["canConnect", "sameVoice", "inVoice", "isDjOnly", "isSpecialChannel"]
})

export class PlaylistCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");

        if (!argument.success) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription('You need to specify the playlist name you want to create')
                .setColor('RED')
            ]
        });

        const data = await playlist.findOne({ User: msg.author.id, Playlist: argument.value });
        let player = this.container.client.manager.get(msg.guild?.id!);

        if (!data) {
            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('Playlist not found')
                    .setColor('RED')
                ]
            })
        } else if (!data.Song.length) {
            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('Playlist empty')
                    .setColor('RED')
                ]
            })
        } else {
            if (!player) {
                player = this.container.client.manager.create({
                    guild: msg.guild?.id as string,
                    voiceChannel: msg.channel?.id as string,
                    textChannel: msg.channel.id as string,
                    volume: 75,
                    selfDeafen: false,
                });
            }

            if (player.state !== "CONNECTED") {
                player.connect();

            }

            const sg = data.Song

            sg.map(async (c: any) => {
                player?.queue.add(TrackUtils.buildUnresolved({
                    title: c.Title,
                    author: c.Author,
                    duration: c.Duration,
                }, msg.author));
                if (!player?.playing && !player?.paused && !player?.queue?.size) player?.play();
            })

            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`Loaded **${argument.value}** with **${sg.length} tracks**`)
                    .setColor(msg.guild?.me?.displayHexColor!)
                ]
            })
        }
    }
}