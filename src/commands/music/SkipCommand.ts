import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "skip",
    aliases: ["s"],
    requiredClientPermissions: ["CONNECT", "SPEAK"],
    preconditions: ["inVoice", "sameVoice", "havePlayer", "haveQueue", "isDjOnly", "isSpecialChannel"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const player = this.container.client.manager.get(msg.guildId!);

        const autoplay = player?.get("autoplay");

        if (autoplay === false) {
            player?.stop();
        } else {
            player?.stop();
            player?.set("autoplay", false);
        }
        msg.react('⏭️').catch(e => { })
    }
}