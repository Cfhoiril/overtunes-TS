import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "back",
    aliases: ["previous", "before", "b"],
    requiredClientPermissions: ["CONNECT", "SPEAK"],
    preconditions: ["inVoice", "sameVoice", "havePlayer"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const player = this.container.client.manager.get(msg.guildId!);

        if (player?.queue.previous == null) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription('I do not found **Previous tracks**')
                .setColor('RED')
            ]
        })

        if (player?.queue.current) {
            player?.queue.unshift(player?.queue?.previous!);
            player.stop();
            msg.react('⏮️').catch(e => { })
        } else {
            player?.queue.add(player?.queue?.previous!)
            player?.play();
            msg.react('⏮️').catch(e => { })
        }
    }
}