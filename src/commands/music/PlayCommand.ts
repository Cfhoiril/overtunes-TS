import { CommandOptions, Command, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, MessageEmbed, MessageButton, MessageActionRow } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "play",
    aliases: ["p"],
    requiredClientPermissions: ["CONNECT", "SPEAK"],
    preconditions: ["inVoice"]
})

export class PrefixCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        console.log("ok")
    }
}