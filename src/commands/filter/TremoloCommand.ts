// @ts-nocheck
import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "tremolo",
    requiredClientPermissions: ["CONNECT", "SPEAK"],
    preconditions: ["inVoice", "sameVoice", "havePlayer", "isDjOnly", "isSpecialChannel", "premCommand"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        return msg.channel.send({
            embeds: new MessageEmbed()
                .setColor("RED")
                .setDescription("This commands currently disabled")
        })
        const player = this.container.client.manager.get(msg.guildId!);

        player?.setTremolo(!player?.filters?.tremolo!);

        msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription(`Tremolo mode is ${player?.filters?.tremolo ? 'On' : 'Off'}`)
                .setColor(msg.guild?.me?.displayHexColor!)
            ]
        })
    }
}