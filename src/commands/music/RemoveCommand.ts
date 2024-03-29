import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "remove",
    aliases: ["rmv", "rm"],
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

        if (!position || isNaN(position) || position < 0) {
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('Please give a valid number')
                    .setColor('RED')]
            })
        }

        if (position > player?.queue?.size!) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor("RED")
                .setDescription(`No tracks at number ${position}, Total tracks in this guild: **${player?.queue?.size}**`)]
        });


        player?.queue.remove(position - 1);
        msg.react('👌').catch(e => { })
    }
}