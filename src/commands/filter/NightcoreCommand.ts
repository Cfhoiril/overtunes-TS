// @ts-nocheck
import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "nightcore",
    aliases: ["nc"],
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

        player?.setNightcore(!player?.filters?.nightcore!);

        msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription(`Nightcore mode is ${player?.filters?.nightcore ? 'On' : 'Off'}`)
                .setColor(msg.guild?.me?.displayHexColor!)
            ]
        })
    }
}