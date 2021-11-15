import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
// @ts-expect-error
import { toMilliseconds, toColonNotation } from "colon-notation";

import * as config from "../../config.json";
import prefix from "../../database/Manager/GuildManager";

@ApplyOptions<CommandOptions>({
    name: "seek",
    aliases: [],
    requiredClientPermissions: ["CONNECT", "SPEAK"],
    preconditions: ["inVoice", "sameVoice", "havePlayer", "isDjOnly", "isSpecialChannel", "haveQueue"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");
        const player = this.container.client.manager.get(msg.guildId!);
        let guildPrefix = await prefix.findOne({ id: msg.guild?.id! })

        if (!argument.success) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription(`Please give a valid duration for example **${guildPrefix.prefix ?? config.prefix}seek ${toColonNotation(player?.queue?.current?.duration! / 2)}**`)
                .setColor('RED')]
        })

        const time = toMilliseconds(argument.value);
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
                    .setDescription(`Invalid track duration, current queue duration is **${toColonNotation(player?.queue.current?.duration)}**`)]
            });
        }
    }
}