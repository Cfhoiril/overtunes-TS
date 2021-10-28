import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "pause",
    aliases: [],
    requiredClientPermissions: ["CONNECT", "SPEAK"],
    preconditions: ["inVoice", "sameVoice", "havePlayer", "isDjOnly", "isSpecialChannel", "haveQueue"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const player = this.container.client.manager.get(msg.guildId!);

        if (player?.paused) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor("RED")
                .setDescription(`The player is already paused`)]
        });


        player?.pause(true);
        player?.set("pause", true)
        msg.react('👌').catch(e => { })
    }
}