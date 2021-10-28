// @ts-nocheck
import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "distortion",
    requiredClientPermissions: ["CONNECT", "SPEAK"],
    preconditions: ["inVoice", "sameVoice", "havePlayer", "isDjOnly", "isSpecialChannel"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const player = this.container.client.manager.get(msg.guildId!);

        player?.setDistortion(!player?.filters?.distortion!);

        msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription(`Distortion mode is ${player?.filters?.distortion ? 'On' : 'Off'}`)
                .setColor(msg.guild?.me?.displayHexColor!)
            ]
        })
    }
}