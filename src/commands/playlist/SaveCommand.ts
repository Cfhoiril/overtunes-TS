import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import playlist from "../../database/Manager/PlaylistManager";

@ApplyOptions<CommandOptions>({
    name: "save",
})

export class PlaylistCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");

        if (!argument.success) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription('You need to specify the playlist to add current track')
                .setColor('RED')
            ]
        });

        const player = this.container.client.manager.get(msg.guildId!);
        const data = await playlist.findOne({ User: msg.author.id, Playlist: argument.value });

        if (data) {
            // ! check if song has reached 100
            if (data.Song.length >= 100) return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('Max tracks on this playlist reached')
                    .setColor('RED')
                ]
            });

            data.Song.push({ Title: player?.queue?.current?.title, Author: player?.queue?.current?.author, Duration: player?.queue?.current?.duration });
            data.save()
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`Added ${player?.queue?.current?.title} to your playlist`)
                    .setColor(msg.guild?.me?.displayHexColor!)
                ]
            })
        } else {
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`Playlist not found`)
                    .setColor('RED')
                ]
            })
        }
    }
}