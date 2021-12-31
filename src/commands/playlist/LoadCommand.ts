import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import playlist from "../../database/Manager/PlaylistManager";
import { TrackUtils } from "erela.js";

@ApplyOptions<CommandOptions>({
    name: "load",
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
            const player = this.container.client.audioQueue.get(msg.guild?.id);
            const node = this.container.client.audioManager.getNode()

            const sg = data.Song

            sg.map(async (c: any) => {
                const res = await node.rest.resolve(c.Title, "youtube");
                const track = res.tracks.shift()
                this.container.client.audioQueue.handle(msg, node, track!)
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