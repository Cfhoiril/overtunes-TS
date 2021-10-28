import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import playlist from "../../database/Manager/PlaylistManager";

@ApplyOptions<CommandOptions>({
    name: "rename",
    preconditions: []
})

export class PlaylistCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");

        if (!argument.success) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription('You need to specify the playlist to want to rename')
                .setColor('RED')
            ]
        });

        const data = await playlist.findOne({ User: msg.author.id, Playlist: argument.value });

        if (!data) {
            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`Playlist not found`)
                    .setColor('RED')
                ]
            })
        } else if (data) {
            msg.channel.send('Now please send a new name')
            let cal0 = await msg.channel.awaitMessages({
                filter: message => message.author.id == msg.author.id,
                max: 1
            });

            data.Playlist = cal0?.first()?.content;
            data.save()

            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`Playlist renamed to **${cal0?.first()?.content}**`)
                    .setColor(msg.guild?.me?.displayHexColor!)
                ]
            })
        }
    }
}