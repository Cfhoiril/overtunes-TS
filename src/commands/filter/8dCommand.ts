// @ts-nocheck
import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "8d",
    aliases: ["eightd"],
    requiredClientPermissions: ["CONNECT", "SPEAK"],
    preconditions: ["inVoice", "sameVoice", "havePlayer", "isDjOnly", "isSpecialChannel"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const player = this.container.client.manager.get(msg.guildId!);

        player?.setEightD(!player?.filters?.eightD!);

        msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription(`8D mode is ${player?.filters?.eightD ? 'On' : 'Off'}`)
                .setColor(msg.guild?.me?.displayHexColor!)
            ]
        })
    }
}