import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import playlist from "../../database/Manager/PlaylistManager";

@ApplyOptions<CommandOptions>({
    name: "playlist",
    aliases: ["list"],
    preconditions: []
})

export class PlaylistCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        playlist.find({ User: msg.author.id }).then((data) => {
            if (!data.length) {
                msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setDescription('You dont have any saved playlist')
                        .setColor('RED')
                    ]
                })
            } else {
                let j = 0
                const pl = new MessageEmbed()
                    .setTitle(`${msg.author.username}'s Playlist`)
                    .setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
                    .setColor(msg.guild?.me?.displayHexColor!)
                    .setDescription(`\`\`\`${data.map((c) => `❯ ${++j}. ${c.Playlist}`).join("\n")}\`\`\``)
                msg.channel.send({ embeds: [pl] })
            }

        })
    }
}