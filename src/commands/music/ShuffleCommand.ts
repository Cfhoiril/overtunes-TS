import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "shuffle",
    aliases: ["sh"],
    requiredClientPermissions: ["CONNECT", "SPEAK"],
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const player = this.container.client.audioQueue.get(msg.guild?.id);

        player?.shuffle();
        msg.react('🔀').catch(e => { })
    }
}