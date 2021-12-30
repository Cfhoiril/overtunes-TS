import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "back",
    aliases: ["previous", "before", "b"],
    requiredClientPermissions: ["CONNECT", "SPEAK"],
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const player = this.container.client.audioQueue.get(msg.guild?.id);

        if (!player.previous) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription('I do not found **Previous tracks**')
                .setColor('RED')
            ]
        })

        if (player?.current) {
            player?.queue.unshift(player?.previous!);
            player.skip();
            msg.react('⏮️').catch(e => { })
        } else {
            player?.queue.push(player?.previous!)
            player?.play();
            msg.react('⏮️').catch(e => { })
        }
    }
}