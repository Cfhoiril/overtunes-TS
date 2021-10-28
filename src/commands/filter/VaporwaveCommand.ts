// @ts-nocheck
import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "vaporwave",
    requiredClientPermissions: ["CONNECT", "SPEAK"],
    preconditions: ["inVoice", "sameVoice", "havePlayer", "isDjOnly", "isSpecialChannel"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const player = this.container.client.manager.get(msg.guildId!);

        player?.setVaporwave(!player?.filters?.vaporwave!);

        msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription(`Vaporwave mode is ${player?.filters?.vaporwave ? 'On' : 'Off'}`)
                .setColor(msg.guild?.me?.displayHexColor!)
            ]
        })
    }
}