// @ts-nocheck
import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "daycore",
    requiredClientPermissions: ["CONNECT", "SPEAK"],
    preconditions: ["inVoice", "sameVoice", "havePlayer", "isDjOnly", "isSpecialChannel"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const player = this.container.client.manager.get(msg.guildId!);

        player?.setDaycore(!player?.filters?.daycore!);

        msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription(`Daycore mode is ${player?.filters?.daycore ? 'On' : 'Off'}`)
                .setColor(msg.guild?.me?.displayHexColor!)
            ]
        })
    }
}