import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import playlist from "../../database/Manager/PlaylistManager";

@ApplyOptions<CommandOptions>({
    name: "addlist",
    preconditions: ["inVoice", "sameVoice", "havePlayer", "haveQueue"]
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
            data.Song.push({ Title: player?.queue?.current?.title, Author: player?.queue?.current?.author, Duration: player?.queue?.current?.duration });

            player?.queue.map((val) => {
                data.Song.push({ Title: val.title, Author: val.author, Duration: val.duration })
            })

            data.save()


            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`${player?.queue?.length! + 1} songs Added to your playlist`)
                    .setColor(msg.guild?.me?.displayHexColor!)
                ]
            })
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