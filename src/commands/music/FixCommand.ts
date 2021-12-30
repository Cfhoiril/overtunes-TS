import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "fix",
    requiredClientPermissions: ["CONNECT", "SPEAK"],
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        msg.guild?.me?.voice?.channel?.setRTCRegion('hongkong').catch(e => { msg.react('🚫').catch(e => { }) })
        msg.react('🔧').catch(e => { })
    }
}