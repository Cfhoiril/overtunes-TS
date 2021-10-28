import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import playlist from "../../database/Manager/PlaylistManager";

@ApplyOptions<CommandOptions>({
    name: "delete",
    preconditions: []
})

export class PlaylistCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");

        if (!argument.success) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription('You need to specify the playlist name you want to delete')
                .setColor('RED')
            ]
        });

        const data = await playlist.findOne({ User: msg.author.id, Playlist: argument.value });

        if (!data) {
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('Playlist not found')
                    .setColor('RED')
                ]
            })
        } else if (data) {
            data.delete()
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('Playlist deleted')
                    .setColor(msg.guild?.me?.displayHexColor!)
                ]
            })
        }
    }
}