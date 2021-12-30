import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "jump",
    aliases: ["skipto"],
    requiredClientPermissions: ["CONNECT", "SPEAK"],
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("number");

        if (!argument.success) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription('Please give a valid number')
                .setColor('RED')]
        })

        const position = Number(argument.value);
        const player = this.container.client.audioQueue.get(msg.guild?.id);

        if (!position || isNaN(position) || position < 0 || position > player?.queue?.size!) {
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('Please give a valid number')
                    .setColor('RED')]
            })
        }

        player?.queue.splice(position - 1, 0);
        player?.queue.splice(0, 0, player?.queue[position - 1]);
        player?.queue.splice(position, 0);

        player?.skip();
        msg.react('👌').catch(e => { })
    }
}