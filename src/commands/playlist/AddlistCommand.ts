import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
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

        const player = this.container.client.manager.get(msg.guildId!);
        const data = await playlist.findOne({ User: msg.author.id, Playlist: argument.value });

        if (data) {
            if (data.Song.length >= 100) return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('Max tracks on this playlist reached')
                    .setColor('RED')
                ]
            });

            data.Song.push({ Title: player?.queue?.current?.title, Author: player?.queue?.current?.author, Duration: player?.queue?.current?.duration });

            // * check the player if has more than 100 tracks
            if (player?.queue.length! > 100) {
                msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setDescription('This Player has more than 100 tracks, will only add 100 first tracks')
                        .setColor('RED')
                    ]
                });
                // ! slice track to 100
                player?.queue.slice(0, 99).map((val) => {
                    data.Song.push({ Title: val.title, Author: val.author, Duration: val.duration })
                })

                data.save()

                msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setDescription(`100 tracks Added to your playlist`)
                        .setColor(msg.guild?.me?.displayHexColor!)
                    ]
                })
            } else {
                player?.queue.map((val) => {
                    data.Song.push({ Title: val.title, Author: val.author, Duration: val.duration })
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