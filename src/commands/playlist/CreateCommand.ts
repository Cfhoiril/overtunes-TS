import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import playlist from "../../database/Manager/PlaylistManager";

@ApplyOptions<CommandOptions>({
    name: "create",
    preconditions: ["premCommand"]
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

        if (argument.value.length > 15) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription('Max playlist name need to be under 15')
                .setColor('RED')
            ]
        });

        if (!/^([a-zA-Z0-9 _-]+)$/.test(argument.value)) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription('Playlist name must be number or letter')
                .setColor('RED')
            ]
        });

        const check = await playlist.find({ User: msg.author.id });
        const data = await playlist.findOne({ User: msg.author.id, Playlist: argument.value });
        if (check.map((c: any) => c.Playlist).length > 9) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription('Maximum amount of playlist reached')
                .setColor('RED')
            ]
        });

        if (data) {
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('That playlist name already exist, please use another name')
                    .setColor('RED')
                ]
            });
        } else {
            new playlist({
                User: msg.author.id,
                Playlist: argument.value
            }).save()

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('Playlist created')
                    .setColor(msg.guild?.me?.displayHexColor!)
                ]
            });
        }
    }
}