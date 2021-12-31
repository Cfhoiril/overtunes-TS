import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { ShoukakuTrack } from "shoukaku";
import playlist from "../../database/Manager/PlaylistManager";

@ApplyOptions<CommandOptions>({
    name: "addlist",
})

export class PlaylistCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");

        if (!argument.success) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription('You need to specify the playlist to add current queue')
                .setColor('RED')
            ]
        });

        const player = this.container.client.audioQueue.get(msg.guild?.id);
        const data = await playlist.findOne({ User: msg.author.id, Playlist: argument.value });

        if (data) {
            if (data.Song.length >= 100) return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('Max tracks on this playlist reached')
                    .setColor('RED')
                ]
            });

            data.Song.push({ Title: player.current.info.title, Author: player.current.info.author, Duration: player.current.info.length });

            // * check the player if has more than 100 tracks
            if (player?.queue.length! > 100) {
                msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setDescription('This Player has more than 100 tracks, will only add 100 first tracks')
                        .setColor('RED')
                    ]
                });
                // ! slice track to 100
                player?.queue.slice(0, 99).map((val: ShoukakuTrack) => {
                    data.Song.push({ Title: val.info.title, Author: val.info.author, Duration: val.info.length })
                })

                data.save()

                msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setDescription(`100 tracks Added to your playlist`)
                        .setColor(msg.guild?.me?.displayHexColor!)
                    ]
                })
            } else {
                player?.queue.slice(0, 99).map((val: ShoukakuTrack) => {
                    data.Song.push({ Title: val.info.title, Author: val.info.author, Duration: val.info.length })
                })

                data.save()

                msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setDescription(`${player?.queue?.length! + 1} tracks Added to your playlist`)
                        .setColor(msg.guild?.me?.displayHexColor!)
                    ]
                })
            }
        } else {
            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`Playlist not found`)
                    .setColor('RED')
                ]
            })
        }

    }
}