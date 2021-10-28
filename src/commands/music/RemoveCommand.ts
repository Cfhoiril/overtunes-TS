import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "jump",
    aliases: ["skipto"],
    requiredClientPermissions: ["CONNECT", "SPEAK"],
    preconditions: ["inVoice", "sameVoice", "havePlayer", "isDjOnly", "isSpecialChannel", "haveQueue"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");

        if (!argument.success) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription('Please give a valid number')
                .setColor('RED')]
        })

        const position = Number(argument.value);
        const player = this.container.client.manager.get(msg.guildId!);

        if (!position || isNaN(position) || position < 0 || position > player?.queue?.size!) {
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('Please give a valid number')
                    .setColor('RED')]
            })
        }

        const positions = position - 1;

        if (positions > player?.queue?.size!) {
            const number = (position + 1);
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`No songs at number ${number}.\nTotal Songs: ${player?.queue?.size}`)]
            });
        }

        player?.queue.remove(position);
        msg.react('👌').catch(e => { })
    }
}