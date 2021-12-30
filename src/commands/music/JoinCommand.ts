import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import QueueManager from "../../structures/audioManager";

@ApplyOptions<CommandOptions>({
    name: "join",
    requiredClientPermissions: ["CONNECT", "SPEAK"],
    aliases: ['summon', 'summons', 'connect'],
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const node = this.container.client.audioManager.getNode();
        const player = await node.joinChannel({
            guildId: msg.guild?.id as string,
            shardId: msg.guild?.shardId as number,
            channelId: msg?.member?.voice?.channel?.id as string,
            deaf: false
        });

        const dispatcher = new QueueManager({
            client: this.container.client,
            guild: msg.guild,
            text: msg.channel,
            player: player,
        });

        this.container.client.audioQueue.set(msg.guild?.id, dispatcher)

        msg.react('👌').catch(e => { })
    }
}