import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "volume",
    aliases: ["vol"],
    requiredClientPermissions: ["CONNECT", "SPEAK"],
    preconditions: ["inVoice", "sameVoice", "havePlayer", "haveQueue", "isDjOnly", "isSpecialChannel"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");
        const player = this.container.client.manager.get(msg.guildId!);

        if (!argument.success) {
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`The current volume is: **${player?.volume}%**`)
                    .setColor(msg.guild?.me?.displayHexColor!)]
            })
        }

        const volume = Number(argument.value);

        if (isNaN(volume)) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription("Volume must be a **Number**")
                .setColor(msg.guild?.me?.displayHexColor!)]
        })

        if (!volume || volume < 0 || volume > 300) {
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`Number of volume between **0 - 300**`)]
            });
        }

        player?.setVolume(volume);

        if (volume > player?.volume!) {
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`Volume set to: **${volume}%**`)
                    .setColor(msg.guild?.me?.displayHexColor!)]
            });
        } else if (volume < player?.volume!) {
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`Volume set to: **${volume}%**`)
                    .setColor(msg.guild?.me?.displayHexColor!)]
            });
        } else {
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`Volume set to: **${volume}%**`)
                    .setColor(msg.guild?.me?.displayHexColor!)]
            });
        }
    }
}