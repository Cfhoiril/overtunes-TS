import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "join",
    requiredClientPermissions: ["CONNECT", "SPEAK"],
    aliases: ['summon', 'summons', 'connect'],
    preconditions: ["inVoice", "sameVoice", "isSpecialChannel"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        let player = this.container.client.manager.create({
            guild: msg.guildId as string,
            voiceChannel: msg.member?.voice.channelId as string,
            textChannel: msg.channelId as string,
            volume: 75,
            selfDeafen: false,
        })

        player.connect()
        player.set("autoplay", false);

        msg.react('👌').catch(e => { })
    }
}