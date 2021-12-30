import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "resume",
    aliases: [],
    requiredClientPermissions: ["CONNECT", "SPEAK"],
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const player = this.container.client.audioQueue.get(msg.guild?.id);

        if (!player?.paused) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor("RED")
                .setDescription(`The player is not paused`)
            ]
        });

        player?.resume();
        msg.react('👌').catch(e => { })
    }
}