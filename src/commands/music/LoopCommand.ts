import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "loop",
    aliases: ["repeat"],
    requiredClientPermissions: ["CONNECT", "SPEAK"],
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");
        const player = this.container.client.audioQueue.get(msg.guild?.id);

        if (!argument.success) {
            if (player.repeat === 0) {
                player.repeat = 1;
                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(msg.guild?.me?.displayHexColor!)
                        .setDescription(`Looping current Queue`)
                    ]
                });
            } else if (player.repeat === 1) {
                player.repeat = 2;
                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(msg.guild?.me?.displayHexColor!)
                        .setDescription(`Looping Current Track`)
                    ]
                });
            } else if (player.repeat === 2) {
                player.repeat = 0;
                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(msg.guild?.me?.displayHexColor!)
                        .setDescription(`Looping now disabled`)
                    ]
                });
            }
            !player?.queueRepeat && !player?.trackRepeat ? player?.setQueueRepeat(true) : !player?.trackRepeat ? player?.setTrackRepeat(true) : player?.setQueueRepeat(false).setTrackRepeat(false)
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`${player?.queueRepeat ? 'Looping Current Queue' : player?.trackRepeat ? 'Looping Current Track' : 'Looping now disabled'}`)
                    .setColor(msg.guild?.me?.displayHexColor!)]
            });
        }

        if (argument.value.toLowerCase() == "track" || argument.value.toLowerCase() == "song") {
            player.repeat = 2;
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('Looping Current Track')
                    .setColor(msg.guild?.me?.displayHexColor!)]
            });
        }

        if (argument.value.toLowerCase() == "queue" || argument.value.toLowerCase() == "all") {
            player.repeat = 1
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('Looping Current Queue')
                    .setColor(msg.guild?.me?.displayHexColor!)]
            });
        }

        if (argument.value.toLowerCase() == "off" || argument.value.toLowerCase() == "disable") {
            player.repeat = 0
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`Looping now disabled`)
                    .setColor(msg.guild?.me?.displayHexColor!)]
            });
        }
    }
}