import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "loop",
    aliases: ["repeat"],
    requiredClientPermissions: ["CONNECT", "SPEAK"],
    preconditions: ["inVoice", "sameVoice", "havePlayer", "isDjOnly", "isSpecialChannel", "haveQueue"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");
        const player = this.container.client.manager.get(msg.guildId!);

        if (!argument.success) {
            !player?.queueRepeat && !player?.trackRepeat ? player?.setQueueRepeat(true) : !player?.trackRepeat ? player?.setTrackRepeat(true) : player?.setQueueRepeat(false).setTrackRepeat(false)
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`${player?.queueRepeat ? 'Looping Current Queue' : player?.trackRepeat ? 'Looping Current Track' : 'Looping now disabled'}`)
                    .setColor(msg.guild?.me?.displayHexColor!)]
            });
        }

        if (argument.value.toLowerCase() == "track" || argument.value.toLowerCase() == "song") {
            player?.setTrackRepeat(!player.trackRepeat);
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`${player?.trackRepeat ? 'Looping Current Track' : 'Looping now disabled'}`)
                    .setColor(msg.guild?.me?.displayHexColor!)]
            });
        }

        if (argument.value.toLowerCase() == "queue" || argument.value.toLowerCase() == "all") {
            player?.setQueueRepeat(!player.queueRepeat);
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`${player?.queueRepeat ? 'Looping Current Queue' : 'Looping now disabled'}`)
                    .setColor(msg.guild?.me?.displayHexColor!)]
            });
        }

        if (argument.value.toLowerCase() == "off" || argument.value.toLowerCase() == "disable") {
            player?.setQueueRepeat(false);
            player?.setTrackRepeat(false);
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`${player?.queueRepeat ? 'Looping Current Queue' : player?.trackRepeat ? 'Looping Current Track' : 'Looping now disabled'}`)
                    .setColor(msg.guild?.me?.displayHexColor!)]
            });
        }
    }
}