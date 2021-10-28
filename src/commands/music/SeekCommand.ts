import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
// @ts-expect-error
import ms from "ms";

@ApplyOptions<CommandOptions>({
    name: "seek",
    aliases: [],
    requiredClientPermissions: ["CONNECT", "SPEAK"],
    preconditions: ["inVoice", "sameVoice", "havePlayer", "isDjOnly", "isSpecialChannel", "haveQueue"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");

        if (!argument.success) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription('Please give a valid duration')
                .setColor('RED')]
        })

        const player = this.container.client.manager.get(msg.guildId!);
        const time = ms(argument.value);
        const position = player?.position;
        const duration = player?.queue.current?.duration;

        if (time <= duration!) {
            if (time > position!) {
                player?.seek(time);
                msg.react('👌').catch(e => { })
            } else {
                player?.seek(time);
                msg.react('👌').catch(e => { })
            }
        } else {
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription('Invalid track duration')]
            });
        }
    }
}